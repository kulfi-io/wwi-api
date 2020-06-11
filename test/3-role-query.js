import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";

const { describe, it } = mocha;
const { expect } = chai;

describe("Role Query", () => {
    describe("Role", () => {
        it("returns admin role", async () => {
            const byId = `query {
                role(id: 2){id display description}
              }`;

            const res = await request(app).get("/api").send({ query: byId });

            const data = JSON.parse(res.text).data.role;
            expect(res.status).equal(200);
            expect(data.display).equal("Admin User");
        });
    });

    describe("Roles", () => {
        it("returns all roles", async () => {
            const byId = `query {
                roles {id display description}
              }`;

            const res = await request(app).get("/api").send({ query: byId });

            const data = JSON.parse(res.text).data.roles;
            const admin = data.filter(x => x.id == 2)[0];
            const basic = data.filter(x => x.id == 1)[0];

            expect(res.status).equal(200);
            expect(data).to.be.an("array")
            expect(basic.display).equal("Basic User - updated");
            expect(admin.display).equal("Admin User");
        });
    });
});
