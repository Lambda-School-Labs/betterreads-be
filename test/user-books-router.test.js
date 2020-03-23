const server = require("../api/server.js");
const request = require("supertest");
const db = require("../database/db-config.js");
const TestObject = require("./test-objects.js");
const knexCleaner = require('knex-cleaner');

const bookObject = TestObject.bookObject;
const otherBook = TestObject.otherBook;
const promisedCookie = TestObject.promisedCookie;

var options = {
	mode: 'truncate',
	restartIdentity: true,
	ignoreTables: ['userBooks']
}


describe("user-books-router", function() {

	beforeEach(async function() {
		await knexCleaner.clean(db, options)
		return request(server)
			.post("/api/auth/signup")
			.send({
				fullName: "Seeder Apple",
				emailAddress: "seedemail",
				password: "seedpassword"
			}).then(res => {
				const cookie = res.headers["set-cookie"]
				return request(server)
					.post('/api/1/library')
					.send({ book: bookObject, readingStatus: 2 })
					.set("cookie", cookie)
			})
	});

	describe("GET user library", function() {
		it("GET books in user library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/1/library")
					.set("cookie", cookie)
					.then(res => {
						expect(res.body[0].authors).toBe("McWorld");
					});
				return req;
			});
		});

		it("GET single book from user libary", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.get("/api/1/library/1")
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.title).toBe("Chantra Swandie");
					});
				return req;
			});
		});
	});

	describe("POST user library", function() {

		it("POST new book in user library and book library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.post("/api/1/library")
					.send({ book: otherBook, readingStatus: 2, favorite: true })
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.bookId).toBe(2)
					});
				return req;
			});
		});
	});

	describe("PUT user library", function() {

		it("PUT favorite and reading status on userbooks", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.put("/api/1/library")
					.send({ bookId: 1, readingStatus: 2, favorite: true, dateStarted: "1990-10-23" })
					.set("cookie", cookie)
					.then(res => {
						expect(res.body.dateStarted).toBe("1990-10-23T00:00:00.000Z")
					});
				return req;
			});
		})

	});

	describe("DELETE userbook", function() {

		it("DELETE userbook from user's library", function() {
			return promisedCookie({ emailAddress: "seedemail", password: "seedpassword" }).then(cookie => {
				const req = request(server)
					.delete("/api/1/library/")
					.send({ bookId: 1 })
					.set("cookie", cookie)
					.then(res => {
						expect(res.status).toBe(204)
					});
				return req;
			});
		});
		
	});

});