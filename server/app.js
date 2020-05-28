const bodyParser = require("body-parser");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongojs = require("mongojs");
const cors = require("cors");
const path = require("path");

/* Configuration import */
let config;
if (!process.env.HEROKU) {
	config = require("./config");
}

const app = express();

const db = mongojs(process.env.MONGODB_URL || config.MONGODB_URL);

app.use("/", express.static("./../frontend/build"));
app.use(bodyParser.json());

app.use(cors());

/* Global middleware */
app.use((req, res, next) => {
	console.log("Server time: ", Date.now());
	next();
});

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

/** Swagger setup */
const swaggerDefinition = {
	info: {
		title: "usput Swagger API Documentation",
		version: "1.0.0",
	},
	host: process.env.SWAGGER_HOST || config.SWAGGER_HOST,
	basePath: "/",
	securityDefinitions: {
		bearerAuth: {
			type: "apiKey",
			name: "Authorization",
			scheme: "bearer",
			in: "header",
		},
	},
};

const options = {
	swaggerDefinition,
	apis: ["./index.js", "./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.get("/swagger.json", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* Express routers */
//Member router
let member_router = express.Router();
require("./routes/member")(member_router, db, mongojs, jwt, config);
app.use("/member", member_router);

/** Stores */
const UsersStore = require("./stores/UsersStore");
const usersStore = new UsersStore(db, mongojs, jwt, config);

/** Login and register */
app.post("/login", (req, res) => {
	usersStore.login(req, res);
});

/**
 * @swagger
 * /google/login:
 *   get:
 *     tags:
 *       - login
 *     name: login
 *     summary: Use Google Open ID to login to the system. If the account does not exist, it will be created based on login info retrieved from Google.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *           description: Invalid user request.
 *       500:
 *         description: Something is wrong with service please contact system administrator
 */

const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID || config.CLIENT_ID,
	process.env.CLIENT_SECRET || config.CLIENT_SECRET,
	process.env.REDIRECT_URL || config.REDIRECT_URL
);

app.get("/google/login", (req, res) => {
	let code = req.query.code;
	if (code) {
		oauth2Client.getToken(code).then((result) => {
			oauth2Client.setCredentials({ access_token: result.tokens.access_token });
			let oauth2 = google.oauth2({
				auth: oauth2Client,
				version: "v2",
			});

			oauth2.userinfo.get((err, response) => {
				if (err) {
					res.status(400).json({ message: `Update failed. Reason: ${err.errmsg}` });
				}
				let data = response.data;

				db.users.findAndModify(
					{
						query: { email: data.email },
						update: {
							$setOnInsert: {
								username: data.given_name.toLowerCase() + "_" + data.family_name.toLowerCase(),
								avatar: data.picture,
								email: data.email,
								firstName: data.given_name,
								lastName: data.family_name,
								type: "Member",
							},
						},
						new: true,
						upsert: true,
					},
					(error, doc) => {
						if (error) {
							console.log(error);
						}
						let jwtToken = jwt.sign(
							{
								...data,
								//exp: Math.floor(Date.now() / 1000) + 3600,
								id: doc._id,
								_id: doc._id,
								type: doc.type,
								username: doc.username,
							},
							process.env.JWT_SECRET || config.JWT_SECRET
						);
						res.redirect(`${process.env.CLIENT_URL || config.CLIENT_URL}/auth#jwt=${jwtToken}`);
					}
				);
			});
		});
	} else {
		const scopes = [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		];

		const url = oauth2Client.generateAuthUrl({
			access_type: "online",
			scope: scopes,
		});
		res.redirect(url);
	}
});

app.post("/register", (req, res) => {
	usersStore.register(req, res);
});

app.use("/", express.static("./../client/build"));
app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "./../client/build/index.html"), function (err) {
		if (err) {
			res.status(500).send(err);
		}
	});
});

module.exports = app;
