const BaseStore = require("./BaseStore");

class OrdersStore extends BaseStore {
	constructor(db, mongojs) {
		super(db);
		if (!!OrdersStore.instance) {
			return OrdersStore.instance;
		}

		OrdersStore.instance = this;
		this.db = db;
		this.mongojs = mongojs;

		return this;
	}

	getRequestedOrders(req, res) {
		let offererId = req.params.offererId;
		let limit = Number(req.query.limit) || 5;
		let offset = Number(req.query.offset) || 0;

		this.db.orders
			.find({
				offererId: offererId,
				isRemoved: false,
				status: { $ne: "completed" },
			})
			.sort({ created: -1 })
			.skip(offset)
			.limit(limit, (error, docs) => {
				if (error) {
					throw error;
				}

				res.json(docs);
			});
	}

	getAppliedOrders(req, res) {
		let applierId = req.params.applierId;
		let limit = Number(req.query.limit) || 5;
		let offset = Number(req.query.offset) || 0;

		this.db.orders
			.find({
				applierId: applierId,
				isRemoved: false,
				status: { $ne: "completed" },
			})
			.sort({ created: -1 })
			.skip(offset)
			.limit(limit, (error, docs) => {
				if (error) {
					throw error;
				}

				res.json(docs);
			});
	}

	createOrder(req, res) {
		let order = req.body;

		this.db.orders.insert(order, (error, docs) => {
			if (error) {
				throw error;
			}
			super.createLog(docs.applierUsername, "applied for", "an offer");
			res.json(docs);
		});
	}

	updateOrder(req, res) {
		let id = req.params.orderId;
		let orderBody = req.body;

		this.db.orders.findAndModify(
			{
				query: { _id: this.mongojs.ObjectId(id) },
				update: { $set: orderBody },
				new: true,
			},
			(error, docs) => {
				if (error) {
					throw error;
				}

				super.createLog(docs.offererUsername, "canceled", `order ${docs.offerName}`);
				res.json(docs);
			}
		);
	}

	completeOrder(req, res) {
		let id = req.params.orderId;
		let orderBody = req.body;

		this.db.orders.findAndModify(
			{
				query: { _id: this.mongojs.ObjectId(id) },
				update: { $set: orderBody },
				new: true,
			},
			(error, docs) => {
				if (error) {
					throw error;
				}

				this.db.transactions.insert(
					{
						...docs,
						dateCompleted: Date.now(),
					},
					(error, docs) => {
						if (error) {
							throw error;
						}
					}
				);

				super.createLog(docs.offererUsername, "completed", `order ${docs.offerName}`);
				res.json(docs);
			}
		);
	}
}

module.exports = OrdersStore;
