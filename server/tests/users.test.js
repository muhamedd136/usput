const request = require("supertest");
const app = require("./../app.js");

describe("Test the API for getting all requested orders for user", () => {
	test("It should response the GET method", async () => {
		const response = await request(app)
			.post("/login")
			.send({
				username: "mu",
				password: "mu",
			})
			.set(
				"Authorization",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMWIzNDc4NDNiZDQ0NTAxOGVlMTNiYSIsInVzZXJuYW1lIjoibXUiLCJ0eXBlIjoiTWVtYmVyIiwiaWF0IjoxNTg3OTk3MDE5fQ.ipstY8N7CqSTEbSoxkqwst_7uRmB7b8CNznJ_1NpGEY"
			);
		json_response = response.body;
		user = json_response.user;
		expect(response.statusCode).toBe(200);
		expect(user.username).toBe("mu");
		expect(user.password).toBe("mu");
	});
});
