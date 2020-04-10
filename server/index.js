const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongojs = require("mongojs");
const cors = require("cors");

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

/** Login and register */
app.post("/login", async (req, res) => {
  try {
    let jwtToken;

    await db.users.findOne({ username: req.body.username }, (err, doc) => {
      if (!doc) {
        return res.status(403).send({ message: "Incorrect username." });
      } else if (doc.password != req.body.password) {
        return res.status(403).send({ message: "Incorrect password." });
      } else {
        jwtToken = jwt.sign(
          {
            id: doc._id,
            username: doc.username,
            type: doc.type,
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
          process.env.JWT_SECRET || config.JWT_SECRET,
          { algorithm: "HS256" }
        );

        res.send({
          user: doc,
          jwt: jwtToken,
        });
      }
    });
  } catch (err) {
    res.status(400).send(`Error: ${error}`);
  }
});

/** Listener  */
app.listen(port, () => {
  console.log("Server listening on port: " + port);
});
