class OfferStore {
	constructor(db, mongojs, currentUser) {
		this.db = db;
		this.currentUser = currentUser;
		this.mongojs = mongojs;
	}

	get_offers(req, res) {
		let limit = Number(req.query.limit) || 5;
		let offset = Number(req.query.offset) || 0;
		this.db.offers
			.find({
				username: { $ne: this.currentUser },
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

	get_user_offers(req, res) {
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

	post_offer(req, res) {
		let offer = req.body;

		this.db.offers.insert(offer, (error, docs) => {
			if (error) {
				throw error;
			}
			createLog(docs.username, "created", "offer");
			res.json(docs);
		});
	}

	get_offer_by_id(req, res) {
		let id = req.params.id;
		this.db.offers.findOne({ _id: this.mongojs.ObjectId(id) }, (error, docs) => {
			if (error) {
				throw error;
			}
			res.json(docs);
		});
	}

	update_offer(req, res) {
		let id = req.params.offerId;
		let offerUpdate = req.body;

		this.db.offers.findAndModify(
			{
				query: { _id: this.mongojs.ObjectId(id) },
				update: { $set: offerUpdate },
				new: true,
			},
			(error, docs) => {
				if (error) {
					throw error;
				}

				createLog(docs.username, "updated", `offer ${docs.name}`);
				res.json(docs);
			}
		);
	}
}

module.exports = OfferStore;
