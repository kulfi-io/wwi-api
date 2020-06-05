import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";

const { describe, it } = mocha;
const { expect } = chai;

describe("Account Query", () => {
    describe("Account", () => {
        it("returns admin user", async () => {
            const byId = `query {
                account(accountId: 2){firstname lastname email verified role {display}}
              }`;

            const res = await request(app).get("/api").send({ query: byId });

            const data = JSON.parse(res.text).data.account;
            expect(res.status).equal(200);
            expect(data.firstname).equal("Admin");
        });
    });

    describe("Accounts", () => {
        it("returns all accounts", async () => {
            const byId = `query {
                accounts {accountid firstname lastname email verified role {display}}
              }`;

            const res = await request(app).get("/api").send({ query: byId });

            const data = JSON.parse(res.text).data.accounts;
            const admin = data.filter(x => x.accountid == 2)[0];
            const basic = data.filter(x => x.accountid == 1)[0];

            expect(res.status).equal(200);
            expect(data).to.be.an("array")
            expect(basic.firstname).equal("Basic - updated");
            expect(admin.role.display).equal("Admin User");
        });
    });
});
