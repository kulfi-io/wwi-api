import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

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
            email: "basic@test.com",
            password: "basic"
        }

        it("returns login info for verified user", async () => {
            const login = `query {
                login(email: "${loginUser.email}", password: "${loginUser.password}") {id fullname token message}
            }`;

            const expectedClaims = ["View Claim","Add Claim","Update Claim"];

            const res = await request(app).get("/api").send({ query: login });
            const data = JSON.parse(res.text).data.login;

            const decriptedToken = jwt.verify(data.token, process.env.SECRET);

            const _claims = JSON.parse(decriptedToken._items).claims;

            expect(res.status).equal(200);
            expect(data.token).not.null;
            expect(decriptedToken._email).equal(loginUser.email);
            expect(_claims).to.deep.equal(expectedClaims);


        });

        const unverfiedUser = {
            email: "admin@test.com",
            password: "admin"
        }

        it("returns verify message for unverified account on login", async () => {
            const login = `query {
                login(email: "${unverfiedUser.email}", password: "${unverfiedUser.password}") {id fullname token message}
            }`;

            const res = await request(app).get("/api").send({ query: login });
            const data = JSON.parse(res.text).data.login;

            expect(res.status).equal(200);
            expect(data.id).equal(-1);
            expect(data.token).be.null;
            expect(data.message).to.equal("Please verify your registration")
        });

        it("returns password mismatch message for incorrect password", async () => {
            const login = `query {
                login(email: "${loginUser.email}", password: "wrongpassword") {id fullname token message}
            }`;

            const res = await request(app).get("/api").send({ query: login });
            const data = JSON.parse(res.text).data.login;

            expect(res.status).equal(200);
            expect(data.id).equal(-1);
            expect(data.token).be.null;
            expect(data.message).to.equal("Username password mistmatch")
        });
    });
});
