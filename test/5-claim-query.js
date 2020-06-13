import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";
import { generateSeederToken } from "../src/util/index.js";

const { describe, it } = mocha;
const { expect } = chai;

const _token = generateSeederToken();

describe("Claim Query", () => {
    describe("Claim", () => {
        it("returns view claim", async () => {
            const byId = `query {
                claim(id: 1){id display description}
              }`;

            const res = await request(app)
                .get("/api")
                .set({ Authorization: _token })
                .send({ query: byId });

            const data = JSON.parse(res.text).data.claim;
            expect(res.status).equal(200);
            expect(data.display).equal("View Claim");
        });
    });

    describe("Claims", () => {
        it("returns all claims", async () => {
            const byId = `query {
                claims {id display description}
              }`;

            const res = await request(app)
                .get("/api")
                .set({ Authorization: _token })
                .send({ query: byId });

            const data = JSON.parse(res.text).data.claims;
            const view = data.filter((x) => x.id == 1)[0];
            const add = data.filter((x) => x.id == 2)[0];

            expect(res.status).equal(200);
            expect(data).to.be.an("array");
            expect(view.display).equal("View Claim");
            expect(add.display).equal("Add Claim");
        });
    });
});
