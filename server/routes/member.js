module.exports = (router, db, mongojs, jwt, config) => {
	const OfferStore = require("../stores/OffersStore.js");
	const LogStore = require("../stores/LogsStore.js");
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

	/* OFFER ROUTES */

	const offerStore = new OfferStore(db, mongojs, currentUser);

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

	/**
	 * @swagger
	 * /member/offers/{user_id}:
	 *   get:
	 *     tags:
	 *       - Offers
	 *     name: Offers
	 *     summary: Get all offers by user id
	 *     parameters:
	 *       - name: user_id
	 *         in: path
	 *         description: ID of the user
	 *         required: true
	 *         type: string
	 *         default: '5dc82504ff68bc92ad7bff63'
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the store list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the store list.
	 *         type: integer
	 *         default: 5
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.get("/offers/:userId", (req, res) => {
		offerStore.get_user_offers(req, res);
	});

	/**
	 * @swagger
	 * /member/offers:
	 *   post:
	 *     tags:
	 *       - Offers
	 *     name: Offers
	 *     summary: Create an offer
	 *     parameters:
	 *       - name: body
	 *         in: body
	 *         description: offer information
	 *         required: true
	 *         type: object
	 *         example: { userId: "", username: "", name: "", price: 0, created: 0, startingLocation: "", endingLocation: "", status: "open", isRemoved: false }
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.post("/offers", (req, res) => {
		offerStore.post_offer(req, res);
	});

	/**
	 * @swagger
	 * /member/offers/find/{offer_id}:
	 *   get:
	 *     tags:
	 *       - Offers
	 *     name: Offers
	 *     summary: Get offer by offer id
	 *     parameters:
	 *       - name: offer_id
	 *         in: path
	 *         description: ID of the offer
	 *         required: true
	 *         type: string
	 *         default: '5dc82504ff68bc92ad7bff63'
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.get("/offers/find/:id", (req, res) => {
		offerStore.get_offer_by_id(req, res);
	});

	/**
	 * @swagger
	 * /member/offers/{offer_id}:
	 *   put:
	 *     tags:
	 *       - Offers
	 *     name: Offers
	 *     summary: Update offer by offer id
	 *     parameters:
	 *       - name: offer_id
	 *         in: path
	 *         description: ID of the offer
	 *         required: true
	 *         type: string
	 *         default: '5dc82504ff68bc92ad7bff63'
	 *       - name: body
	 *         in: body
	 *         description: offer information
	 *         required: true
	 *         type: object
	 *         example: { userId: "", username: "", name: "", price: 0, created: 0, startingLocation: "", endingLocation: "", status: "", isRemoved: false }
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.put("/offers/:offerId", (req, res) => {
		offerStore.update_offer(req, res);
	});

	/**
	 * @swagger
	 * /member/offers/delete/{offer_id}:
	 *   delete:
	 *     tags:
	 *       - Offers
	 *     name: Offers
	 *     summary: Delete offer by offer id
	 *     parameters:
	 *       - name: offer_id
	 *         in: path
	 *         description: ID of the offer
	 *         required: true
	 *         type: string
	 *         default: '5dc82504ff68bc92ad7bff63'
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.put("/offers/delete/:id", (req, res) => {
		offerStore.delete_offer(req, res);
	});

	/* LOG ROUTES */

	const logStore = new LogStore(db, mongojs, currentUser);

	/**
	 * @swagger
	 * /member/logs/{user_id}:
	 *   get:
	 *     tags:
	 *       - Logs
	 *     name: Logs
	 *     summary: Get all logs by user id
	 *     parameters:
	 *       - name: user_id
	 *         in: path
	 *         description: ID of the user
	 *         required: true
	 *         type: string
	 *         default: '5dc82504ff68bc92ad7bff63'
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the store list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the store list.
	 *         type: integer
	 *         default: 5
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.get("/logs/:username", (req, res) => {
		logStore.get_user_log(req, res);
	});
};
