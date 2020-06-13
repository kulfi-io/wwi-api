import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";
import { generateSeederToken } from "../src/util/index.js";

const { describe, it } = mocha;
const { expect } = chai;

const _token = generateSeederToken();

describe("Role Claim Query", () => {
    describe("Claim", () => {
        it("returns view role claim", async () => {
            const byId = `query {
                roleClaim(id: 1){id role claim}
              }`;

            const res = await request(app)
                .get("/api")
                .set({ Authorization: _token })
                .send({ query: byId });

            const data = JSON.parse(res.text).data.roleClaim;
            expect(res.status).equal(200);
            expect(`${data.role} ${data.claim}`).equal(
                "Basic User - updated View Claim"
            );
        });
    });

    describe("Claims", () => {
        it("returns all claims", async () => {
            const byId = `query {
                roleClaims {id role claim}
              }`;

            const res = await request(app)
                .get("/api")
                .set({ Authorization: _token })
                .send({ query: byId });

            const data = JSON.parse(res.text).data.roleClaims;
            const add = data.filter((x) => x.id == 2)[0];
            const update = data.filter((x) => x.id == 3)[0];

            expect(res.status).equal(200);
            expect(data).to.be.an("array");
            expect(`${update.role} ${update.claim}`).equal(
                "Basic User - updated Update Claim"
            );
            expect(`${add.role} ${add.claim}`).equal(
                "Basic User - updated Add Claim"
            );
        });
    });
});
