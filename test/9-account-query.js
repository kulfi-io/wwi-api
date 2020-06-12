import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";

const { describe, it } = mocha;
const { expect } = chai;

describe("Account Query", () => {
    describe("Account", () => {
        it("returns admin account", async () => {
            const byId = `query {
                account(id: 2){firstname lastname email verified role {display}}
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
                accounts {id firstname lastname email verified role {display}}
              }`;

            const res = await request(app).get("/api").send({ query: byId });

            const data = JSON.parse(res.text).data.accounts;
            const admin = data.filter((x) => x.id == 2)[0];
            const basic = data.filter((x) => x.id == 1)[0];

            expect(res.status).equal(200);
            expect(data).to.be.an("array");
            expect(basic.firstname).equal("Basic - updated");
            expect(admin.role.display).equal("Admin User");
        });
    });

    describe("Account Search", () => {
        it("returns by search criteria", async () => {
            const search = `query {
                accountSearch(criteria: "min") {id firstname lastname email verified role {display}}
              }`;

            const res = await request(app).get("/api").send({ query: search });

            const data = JSON.parse(res.text).data.accountSearch;

            expect(res.status).equal(200);
            expect(data).to.be.an("array");
        });
    });

    describe("Login", () => {
        const loginUser = {
            email: "admin@test.com",
            password: "admin"
        }

        it("returns login info for verified user", async () => {
            const login = `query {
                login(email: "${loginUser.email}", password: "${loginUser.password}") {id firstname fullname email verified role {display} message}
              }`;

            const res = await request(app).get("/api").send({ query: login });

            const data = JSON.parse(res.text).data.login;

            expect(res.status).equal(200);
        });
    });
});
