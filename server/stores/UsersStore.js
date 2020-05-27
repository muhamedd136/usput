const BaseStore = require("./BaseStore");
const bcrypt = require("bcryptjs");

class UsersStore extends BaseStore {
  constructor(db, mongojs, jwt, config) {
    super(db);
    if (!!UsersStore.instance) {
      return UsersStore.instance;
    }

    UsersStore.instance = this;
    this.db = db;
    this.mongojs = mongojs;
    this.jwt = jwt;
    this.config = config;

    return this;
  }

  login(req, res) {
    try {
      let jwtToken;

      this.db.users.findOne({ username: req.body.username }, (err, doc) => {
        if (!doc) {
          return res.status(403).send({ message: "Incorrect username." });
        } else {
          bcrypt.compare(
            req.body.password,
            doc.password,
            (error, bResponse) => {
              if (bResponse === false) {
                return res.status(403).send({ message: "Incorrect password." });
              }
              if (bResponse === true) {
                jwtToken = this.jwt.sign(
                  {
                    id: doc._id,
                    username: doc.username,
                    type: doc.type,
                    //exp: Math.floor(Date.now() / 1000) + 3600,
                  },
                  process.env.JWT_SECRET || this.config.JWT_SECRET,
                  { algorithm: "HS256" }
                );

                res.send({
                  user: {
                    _id: doc._id,
                    username: doc.username,
                    firstName: doc.firstName,
                    lastName: doc.lastName,
                    email: doc.email,
                    type: doc.type,
                  },
                  jwt: jwtToken,
                });
              }
            }
          );
        }
      });
    } catch (err) {
      res.status(400).send(`Error: ${err}`);
    }
  }

  register(req, res) {
    try {
      this.db.users.findOne(
        { username: req.body.username },
        async (err, docs) => {
          if (docs != null) {
            return res.status(400).send("Register failed! User already exists");
          }

          bcrypt.hash(req.body.password, 10, async (err, hash) => {
            await this.db.users.insert(
              {
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
                email: req.body.email,
                type: "Member",
              },
              (error, response) => {
                if (error) {
                  return res
                    .status(400)
                    .send(`Insertion failed! Reason: ${error.errmsg}`);
                }
                res.json(response);
              }
            );
          });
        }
      );
    } catch (error) {
      res.status(400).send(error);
    }
  }

  getUser(req, res) {
    let id = req.params.userId;

    this.db.users.findOne({ _id: this.mongojs.ObjectId(id) }, (error, docs) => {
      if (error) {
        console.log(error.errmsg);
      }
      res.json(docs);
    });
  }

  updateUser(req, res) {
    let id = req.params.userId;
    let body = req.body;

    this.db.users.findAndModify(
      {
        query: { _id: this.mongojs.ObjectId(id) },
        update: { $set: body },
        new: true,
      },
      (error, docs) => {
        if (error) {
          console.log(error.errmsg);
        }

        super.createLog(docs.username, "updated", "profile");
        res.json(docs);
      }
    );
  }

  getUserOffers(req, res) {
    let userId = req.params.userId;
    let limit = Number(req.query.limit) || 5;
    let offset = Number(req.query.offset) || 0;

    this.db.offers.aggregate(
      [
        {
          $facet: {
            records: [
              { $match: { userId: userId, isRemoved: false } },
              { $sort: { created: -1 } },
              { $skip: offset },
              { $limit: limit },
            ],
            total: [
              { $match: { userId: userId, isRemoved: false } },
              { $count: "count" },
            ],
          },
        },
      ],
      (error, docs) => {
        if (error) {
          console.log(error.errmsg);
        }
        res.json(docs);
      }
    );
  }
}

module.exports = UsersStore;
