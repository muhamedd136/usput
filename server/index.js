const app = require("./app");
const port = process.env.PORT || 2000;
/** Listener  */
app.listen(port, () => {
	console.log("Server listening on port: " + port);
});
