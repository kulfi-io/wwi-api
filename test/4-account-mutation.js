import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";


const { describe, it } = mocha;
const { expect } = chai;

describe("Account Mutations", () => {
    const basic ={
        firstName: "Basic",
        lastName: "Account",
        email: "basic@test.com",
        password: "basic",
        roleId: 1

    };

    const admin = {
        firstName: "Admin",
        lastName: "Account",
        email: "admin@test.com",
        password: "admin",
        roleId: 2
    };

    const demo = {
        firstName: "Demo",
        lastName: "Account",
        email: "demo@test.com",
        password: "demo",
        roleId: 1
    };

   

    describe("Add", async () => {
        const addBasic = `mutation { addAccount(firstName: "${basic.firstName}", lastName: "${basic.lastName}", email: "${basic.email}", password: "${basic.password}", roleId: ${basic.roleId})
            {accountid}
        }`;

        const addAdmin = `mutation { addAccount(firstName: "${admin.firstName}", lastName: "${admin.lastName}", email: "${admin.email}", password: "${admin.password}", roleId: ${admin.roleId})
            {accountid}
        }`;

        const addDemo = `mutation { addAccount(firstName: "${demo.firstName}", lastName: "${demo.lastName}", email: "${demo.email}", password: "${demo.password}", roleId: ${demo.roleId})
            {accountid}
        }`;

        let res, data;

        const insertBasic = () => {
            return new Promise((resolve, reject) => {
                it("adds basic user", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addBasic });
                    

                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addAccount;
                    expect(res.status).equal(200);
                    expect(data.accountid).equal(1);

                    resolve();
                });

            });            
        };

        const insertAdmin = () => {
            return new Promise((resolve, reject) => {
                it("adds admin user", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addAdmin });


                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addAccount;
                    expect(res.status).equal(200);
                    expect(data.accountid).equal(2);

                    resolve();
                });

            });            
        };

        const insertDemo = () => {
            return new Promise((resolve, reject) => {
                it("adds demo user", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addDemo });

                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addAccount;
                    expect(res.status).equal(200);
                    expect(data.accountid).equal(3);

                    resolve();
                });

            });            
        };


        insertBasic().then(insertAdmin()).then(insertDemo());
    });

    describe("Update", async () => {
        const update = `mutation { updateAccount(accountId: 1, firstName: "${basic.firstName} - updated", lastName: "${basic.lastName}", email: "${basic.email}", roleId: ${basic.roleId})
            {firstname}
        }`;

        it("Updates basic account", async () => {
            const res = await request(app).post("/api").send({ query: update });

            const data = JSON.parse(res.text).data.updateAccount;
            expect(res.status).equal(200);
            expect(data.firstname).equal(`${basic.firstName} - updated`);
        });
    });

    describe("Delete", async () => {
        const query = `mutation { deleteAccount(accountId: 3) {accountid} }`;

        it("Delete demo account", async () => {
            const res = await request(app).post("/api").send({ query: query });

            expect(res.status).equal(200);
        });

        it("Delete with invalid id generates error", async () => {
            const res = await request(app).post("/api").send({ query: query });

            expect(res.error);
        });
    });
});
