const BaseStore = require("./BaseStore");

class TransactionsStore extends BaseStore {
  constructor(db, mongojs) {
    super(db);
    this.db = db;
    this.mongojs = mongojs;
  }

  getUserTransactions(req, res) {
    let userId = req.params.userId;
    let limit = Number(req.query.limit) || 5;
    let offset = Number(req.query.offset) || 0;

    this.db.transactions
      .find({ offererId: userId })
      .skip(offset)
      .limit(limit, (error, docs) => {
        if (error) {
          throw error;
        }
        res.json(docs);
      });
  }
}

module.exports = TransactionsStore;
