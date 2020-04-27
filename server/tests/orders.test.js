const request = require("supertest");
const app = require("./../app.js");

describe("Test the API for getting all requested orders for user", () => {
	test("It should response the GET method", async () => {
		const response = await request(app)
			.get("/member/orders/requested/5e1cb0b6269d620e90760630")
			.set(
				"Authorization",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMWIzNDc4NDNiZDQ0NTAxOGVlMTNiYSIsInVzZXJuYW1lIjoibXUiLCJ0eXBlIjoiTWVtYmVyIiwiaWF0IjoxNTg3OTk3MDE5fQ.ipstY8N7CqSTEbSoxkqwst_7uRmB7b8CNznJ_1NpGEY"
			);
		json_res = JSON.parse(response.text)[0];
		console.log(json_res);
		expect(response.statusCode).toBe(200);
		expect(json_res.offerName[0]).toBe("muhamed 2");
		expect(json_res.offerPrice[0]).toBe("2");
		expect(json_res.offererId).toBe("5e1cb0b6269d620e90760630");
	});
});
