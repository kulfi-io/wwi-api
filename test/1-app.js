import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";

const {describe, it} = mocha;
const {expect, assert} = chai;

describe("API", () => {

    describe("Express check", () => {
        it("returns Express is working! with status code 200", () => {
            request(app)
            .get("/")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.text).to.equal("Express is working!");
            });
        });

    });
   
    describe("Health check", () => {
        it("return I am alive! from api health check", async () => {
            const res = await request(app).get("/api")
            .send({query: `{health}`});
    
            const data = JSON.parse(res.text).data;
            expect(res.status).to.equal(200);
            expect(data.health).to.equal("I am alive!")
        });
    });
});
