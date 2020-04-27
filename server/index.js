const bodyParser = require("body-parser");
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

const port = process.env.PORT || 2000;
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

/** Listener  */
app.listen(port, () => {
	console.log("Server listening on port: " + port);
});
