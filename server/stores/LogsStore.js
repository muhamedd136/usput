const BaseStore = require("../stores/BaseStore.js");
class LogStore extends BaseStore {
	constructor(db, mongojs, currentUser) {
		super(db);
		this.db = db;
		this.currentUser = currentUser;
		this.mongojs = mongojs;
	}

	get_user_log(req, res) {
		let username = req.params.username;
		let limit = Number(req.query.limit) || 5;
		let offset = Number(req.query.offset) || 0;

		this.db.logs
			.find({ username: username })
			.sort({ created: -1 })
			.skip(offset)
			.limit(limit, (err, docs) => {
				if (err) {
					console.log(err.errmsg);
				}
				res.json(docs);
			});
	}
}

module.exports = LogStore;
