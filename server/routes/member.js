module.exports = (router, db, mongojs, jwt, config) => {
	const TransactionsStore = require("../stores/TransactionsStore");
	const OfferStore = require("../stores/OffersStore.js");
	const UsersStore = require("../stores/UsersStore.js");
	const OrdersStore = require("../stores/OrdersStore");
	const LogStore = require("../stores/LogsStore.js");

	let currentUser;

	/** STORES */
	let offerStore;
	let transactionStore;
	let userStore;
	let logStore;
	let orderStore;

	/** AUTHENTICATION */
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
						offerStore = new OfferStore(db, mongojs, currentUser);
						transactionStore = new TransactionsStore(db, mongojs);
						userStore = new UsersStore(db, mongojs, jwt, config);
						logStore = new LogStore(db, mongojs, currentUser);
						orderStore = new OrdersStore(db, mongojs);
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

	/* USER ROUTES */

	/**
	 * @swagger
	 * /member/users/{user_id}:
	 *  get:
	 *    tags:
	 *      - Users
	 *    name: Get user/profile info by id
	 *    summary: Fetch user by requested id
	 *    security:
	 *      - bearerAuth: []
	 *    consumes:
	 *      - application/json
	 *    parameters:
	 *      - name: user_id
	 *        in: path
	 *        description: ID of the user
	 *        required: true
	 *        type: string
	 *        default: '5dc82504ff68bc92ad7bff63'
	 */
	router.get("/users/:userId", (req, res) => {
		userStore.getUser(req, res);
	});

	/**
	 * @swagger
	 * /member/users/{user_id}:
	 *  put:
	 *    tags:
	 *      - Users
	 *    name: Update user by id
	 *    summary: Update user by requested id
	 *    security:
	 *      - bearerAuth: []
	 *    consumes:
	 *      - application/json
	 *    parameters:
	 *      - name: user_id
	 *        in: path
	 *        description: ID of the user
	 *        required: true
	 *        type: string
	 *        default: '5dc82504ff68bc92ad7bff63'
	 *      - body: body
	 *        in: body
	 *        description: user information
	 *        required: true
	 *        type: object
	 *        example: { id: 0, username: "", avatar: "", firstName: "", lastName: "", email: "", address: "", zipCode: 0, city: "", country: "", completedOffers: 0, rating: 0 }
	 */
	router.put("/users/:userId", (req, res) => {
		userStore.updateUser(req, res);
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
		userStore.getUserOffers(req, res);
	});

	/* OFFER ROUTES */

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

	/* ORDER ROUTES */

	/**
	 * @swagger
	 * /member/orders/requested/{offererId}:
	 *   get:
	 *     tags:
	 *       - Orders
	 *     name: Orders
	 *     summary: Get all requested orders for user
	 *     parameters:
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the orders list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the orders list.
	 *         type: integer
	 *         default: 5
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.get("/orders/requested/:offererId", (req, res) => {
		orderStore.getRequestedOrders(req, res);
	});

	/**
	 * @swagger
	 * /member/orders/applied/{applierId}:
	 *   get:
	 *     tags:
	 *       - Orders
	 *     name: Orders
	 *     summary: Get all applied orders for user
	 *     parameters:
	 *       - name: offset
	 *         in: query
	 *         description: The offset of the orders list.
	 *         type: integer
	 *         default: 0
	 *       - name: limit
	 *         in: query
	 *         description: The limit of the orders list.
	 *         type: integer
	 *         default: 5
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.get("/orders/applied/:applierId", (req, res) => {
		orderStore.getAppliedOrders(req, res);
	});

	/**
	 * @swagger
	 * /member/orders:
	 *   post:
	 *     tags:
	 *       - Orders
	 *     name: Orders
	 *     summary: Create an order
	 *     parameters:
	 *       - name: body
	 *         in: body
	 *         description: order information
	 *         required: true
	 *         type: object
	 *         example: { offererId: "", offererUsername: "", applierUsername: "", applierId: "", offerName: "", offerPrice: 0, createdDate: 0, startingLocation: "", endingLocation: "", appliedDate: 0, status: "", isRemoved: false }
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.post("/orders", (req, res) => {
		orderStore.createOrder(req, res);
	});

	/**
	 * @swagger
	 * /member/orders/{order_id}:
	 *   delete:
	 *     tags:
	 *       - Orders
	 *     name: Orders
	 *     summary: Cancel order by order id
	 *     parameters:
	 *       - name: order_id
	 *         in: path
	 *         description: ID of the order
	 *         required: true
	 *         type: string
	 *         default: '5dc82504ff68bc92ad7bff63'
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.put("/orders/:orderId", (req, res) => {
		orderStore.updateOrder(req, res);
	});

	/**
	 * @swagger
	 * /member/orders/complete/{order_id}:
	 *   put:
	 *     tags:
	 *       - Orders
	 *     name: Orders
	 *     summary: Complete order by order id
	 *     parameters:
	 *       - name: order_id
	 *         in: path
	 *         description: ID of the order
	 *         required: true
	 *         type: string
	 *         default: '5dc82504ff68bc92ad7bff63'
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.put("/orders/complete/:orderId", (req, res) => {
		orderStore.completeOrder(req, res);
	});

	/* TRANSACTION ROUTES */

	/**
	 * @swagger
	 * /member/transactions/{user_id}:
	 *   get:
	 *     tags:
	 *       - Transactions
	 *     name: Transactions
	 *     summary: Get transactions by user id
	 *     parameters:
	 *       - name: user_id
	 *         in: path
	 *         description: ID of the user
	 *         required: true
	 *         type: string
	 *         default: '5dc82504ff68bc92ad7bff63'
	 *     security:
	 *       - bearerAuth: []
	 *     produces:
	 *       - application/json
	 */
	router.get("/transactions/:userId", (req, res) => {
		transactionStore.getUserTransactions(req, res);
	});

	/* LOG ROUTES */

	/**
	 * @swagger
	 * /member/logs:
	 *   get:
	 *     tags:
	 *       - Logs
	 *     name: Logs
	 *     summary: Get all logs
	 *     parameters:
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
	router.get("/logs", (req, res) => {
		logStore.get_logs(req, res);
	});

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
		logStore.get_user_logs(req, res);
	});
};
