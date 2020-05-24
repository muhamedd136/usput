const BaseStore = require("../stores/BaseStore.js");
class LogStore extends BaseStore {
  constructor(db, mongojs, currentUser) {
    super(db);
    if (!!LogStore.instance) {
      return LogStore.instance;
    }

    LogStore.instance = this;
    this.db = db;
    this.currentUser = currentUser;
    this.mongojs = mongojs;
    return this;
  }

  get_user_logs(req, res) {
    let username = req.params.username;
    let limit = Number(req.query.limit) || 5;
    let offset = Number(req.query.offset) || 0;

    // this.db.logs
    //   .find({ username: username })
    //   .sort({ created: -1 })
    //   .skip(offset)
    //   .limit(limit, (err, docs) => {
    //     if (err) {
    //       console.log(err.errmsg);
    //     }
    //     res.json(docs);
    //   });

    this.db.logs.aggregate(
      [
        {
          $facet: {
            records: [
              { $match: { username: username } },
              { $sort: { created: -1 } },
              { $skip: offset },
              { $limit: limit },
            ],
            total: [{ $match: { username: username } }, { $count: "count" }],
          },
        },
      ],
      (err, docs) => {
        if (err) {
          console.log(err.errmsg);
        }
        res.json(docs);
      }
    );
  }

  get_logs(req, res) {
    let limit = Number(req.query.limit) || 5;
    let offset = Number(req.query.offset) || 0;

    this.db.logs.aggregate(
      [
        {
          $facet: {
            records: [
              { $match: {} },
              { $sort: { created: -1 } },
              { $skip: offset },
              { $limit: limit },
            ],
            total: [{ $count: "count" }],
          },
        },
      ],
      (error, docs) => {
        if (error) {
          throw error;
        }

        res.json(docs);
      }
    );

    // this.db.logs
    //   .find({})
    //   .sort({ created: -1 })
    //   .skip(offset)
    //   .limit(limit, (error, docs) => {
    //     if (error) {
    //       throw error;
    //     }
    //     res.json(docs);
    //   });
  }
}

module.exports = LogStore;
