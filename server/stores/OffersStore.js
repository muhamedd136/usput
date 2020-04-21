module.exports = {
	get_offers: async (req, res, db, currentUser) => {
		let limit = Number(req.query.limit) || 5;
		let offset = Number(req.query.offset) || 0;
		db.offers
			.find({
				username: { $ne: currentUser },
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
	},
};
