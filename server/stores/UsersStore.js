const BaseStore = require("./BaseStore");

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
				} else if (doc.password != req.body.password) {
					return res.status(403).send({ message: "Incorrect password." });
				} else {
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
						user: doc,
						jwt: jwtToken,
					});
				}
			});
		} catch (err) {
			res.status(400).send(`Error: ${err}`);
		}
	}

	register(req, res) {
		try {
			this.db.users.findOne({ username: req.body.username }, async (err, docs) => {
				if (docs != null) {
					return res.status(400).send("Register failed! User already exists");
				}

				await this.db.users.insert(
					{
						username: req.body.username,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						password: req.body.password,
						email: req.body.email,
						type: "Member",
					},
					(error, response) => {
						if (error) {
							return res.status(400).send(`Insertion failed! Reason: ${error.errmsg}`);
						}
						res.json(docs);
					}
				);
			});
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

		this.db.offers
			.find({ userId: userId, isRemoved: false })
			.sort({ created: -1 })
			.skip(offset)
			.limit(limit, (error, docs) => {
				if (error) {
					console.log(error.errmsg);
				}
				res.json(docs);
			});
	}
}

module.exports = UsersStore;
