const request = require("supertest");
const app = require("./../app.js");

describe("Test the API for getting all offers", () => {
	test("It should response the GET method", async () => {
		const response = await request(app)
			.get("/member/offers")
			.set(
				"Authorization",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMWIzNDc4NDNiZDQ0NTAxOGVlMTNiYSIsInVzZXJuYW1lIjoibXUiLCJ0eXBlIjoiTWVtYmVyIiwiaWF0IjoxNTg3OTk3MDE5fQ.ipstY8N7CqSTEbSoxkqwst_7uRmB7b8CNznJ_1NpGEY"
			);
		json_res = JSON.parse(response.text);
		expect(response.statusCode).toBe(200);
		expect(json_res.length).toBe(5);
	});
});

describe("Test the API for getting a offer by id", () => {
	test("It should response the GET method", async () => {
		const response = await request(app)
			.get("/member/offers/find/5e1f1849e98d5d30d88553d8")
			.set(
				"Authorization",
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMWIzNDc4NDNiZDQ0NTAxOGVlMTNiYSIsInVzZXJuYW1lIjoibXUiLCJ0eXBlIjoiTWVtYmVyIiwiaWF0IjoxNTg3OTk3MDE5fQ.ipstY8N7CqSTEbSoxkqwst_7uRmB7b8CNznJ_1NpGEY"
			);
		json_res = JSON.parse(response.text);
		expect(response.statusCode).toBe(200);
		expect(json_res.username).toBe("muhakng");
		expect(json_res.price[0]).toBe("5");
		expect(json_res.name[0]).toBe("muhamed");
	});
});
