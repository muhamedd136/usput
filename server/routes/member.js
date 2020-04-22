module.exports = (router, db, mongojs, jwt, config) => {
	const OfferStore = require("../stores/OffersStore.js");
	let currentUser;

	router.use((req, res, next) => {
		console.log(`Member route accessed by: ${req.ip}`);

		/* Check for proper JWT */
		let authorization = req.get("Authorization");

		if (authorization) {
			jwt.verify(authorization, process.env.JWT_SECRET || config.JWT_SECRET, (err, decoded) => {
				if (err) {
					res.status(401).send({ message: "Unauthorized access: " + err.message });
				} else {
					currentUser = decoded.username;
					let userType = decoded.type;
					if (userType == "Member") {
						next();
					} else {
						res.status(401).send("Unauthorized access, improper privileges.");
					}
				}
			});
		} else {
			res.status(401).send("Unauthorized access.");
		}
	});

	const offerStore = new OfferStore(db, currentUser);

	/**
	 * @swagger
	 * /member/offers:
	 *   get:
	 *     tags:
	 *       - Offers
	 *     name: Offers
	 *     summary: Get all offers
	 *     parameters:
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the offer list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the offer list.
	 *         type: integer
	 *         default: 5
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.get("/offers", (req, res) => {
		offerStore.get_offers(req, res);
	});
};
