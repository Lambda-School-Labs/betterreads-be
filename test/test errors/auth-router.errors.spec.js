const request = require("supertest");

const server = require("../../api/server");

describe("error testing for auth-router.js", () => {
    afterAll(async () => {
        await pg.end();
    });
    
    describe("error testing for POST to /api/auth/signup", () => {
        it("returns 400 if user already exists", async () => {
            return request(server)
                .post("/api/auth/signup")
                .send({ "emailAddress": "test", "password": "test" })
                .then(response => expect(response.status).toBe(400))
        });
    });
    
    describe("error testing for POST to /api/auth/signin", () => {
        it("returns 400 if the user doesn't exist", async () => {
            return request(server)
                .post("/api/auth/signin")
                .send({ "emailAddress": "nonexistent", "password": "test" })
                .then(response => expect(response.status).toBe(400))
            });
    });     
});