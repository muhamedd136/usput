class BaseStore {
	constructor(db) {
		this.db = db;
	}

	createLog(user, status, type) {
		let message = `User ${user} has ${status} ${type}.`;

		this.db.logs.insert({ message: message, created: Date.now(), username: user }, (error, docs) => {
			if (error) {
				throw error;
			}
		});
	}
}

module.exports = BaseStore;
