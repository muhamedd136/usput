const request = require("supertest");
const app = require("./../app.js");

describe("Test the API for login in the user", () => {
	test("It should response the POST method", async () => {
		const response = await request(app).post("/login").send({
			username: "mu",
			password: "mu",
		});
		json_response = response.body;
		user = json_response.user;
		expect(response.statusCode).toBe(200);
		expect(user.username).toBe("mu");
		expect(user.password).toBe("mu");
	});
});

describe("Test the API for register user", () => {
	test("It should response the POST method", async () => {
		const response = await request(app).post("/register").send({
			username: "beri",
			firstName: "Aldin",
			lastName: "Berisa",
			password: "beri",
			email: "beri@outlook.com",
			type: "Member",
		});
		json_response = response.body;
		expect(response.statusCode).toBe(200);
		expect(json_response.username).toBe("beri");
		expect(json_response.firstName).toBe("Aldin");
		expect(json_response.lastName).toBe("Berisa");
		expect(json_response.email).toBe("beri@outlook.com");
		expect(json_response.type).toBe("Member");
	});
});
