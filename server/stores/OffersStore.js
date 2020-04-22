// module.exports = {
// 	get_offers: (req, res, db, currentUser) => {
// 		let response;
// 		let limit = Number(req.query.limit) || 5;
// 		let offset = Number(req.query.offset) || 0;
// 		db.offers
// 			.find({
// 				username: { $ne: currentUser },
// 				isRemoved: false,
// 				status: { $ne: "completed" },
// 			})
// 			.sort({ created: -1 })
// 			.skip(offset)
// 			.limit(limit, (error, docs) => {
// 				if (error) {
// 					throw error;
// 				}
// 				//res.json(docs);
// 				console.log(docs);
// 				response = docs;
// 			});
// 		console.log(response);
// 		return response;
// 	},
// };

class OfferStore {
	constructor(db, currentUser) {
		this.db = db;
		this.currentUser = currentUser;
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
}

module.exports = OfferStore;
