import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";

const { describe, it } = mocha;
const { expect } = chai;



describe("Account Mutations", () => {
    const basic ={
        firstname: "Basic",
        lastname: "Account",
        email: "basic@test.com",
        password: "basic",
        roleId: 1

    };

    const admin = {
        firstname: "Admin",
        lastname: "Account",
        email: "admin@test.com",
        password: "admin",
        roleId: 2
    };

    const demo = {
        firstname: "Demo",
        lastname: "Account",
        email: "demo@test.com",
        password: "demo",
        roleId: 1
    };

   

    describe("Add", async () => {
        const addBasic = `mutation { addAccount(firstname: "${basic.firstname}", lastname: "${basic.lastname}", email: "${basic.email}", password: "${basic.password}", roleid: ${basic.roleId})
            {id}
        }`;

        const addAdmin = `mutation { addAccount(firstname: "${admin.firstname}", lastname: "${admin.lastname}", email: "${admin.email}", password: "${admin.password}", roleid: ${admin.roleId})
            {id}
        }`;

        const addDemo = `mutation { addAccount(firstname: "${demo.firstname}", lastname: "${demo.lastname}", email: "${demo.email}", password: "${demo.password}", roleid: ${demo.roleId})
            {id}
        }`;

        let res, data;

        const insertBasic = () => {
            return new Promise((resolve, reject) => {
                it("adds basic account", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addBasic });
                    

                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addAccount;
                    expect(res.status).equal(200);
                    expect(data.id).equal(1);

                    resolve();
                });

            });            
        };

        const insertAdmin = () => {
            return new Promise((resolve, reject) => {
                it("adds admin account", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addAdmin });


                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addAccount;
                    expect(res.status).equal(200);
                    expect(data.id).equal(2);

                    resolve();
                });

            });            
        };

        const insertDemo = () => {
            return new Promise((resolve, reject) => {
                it("adds demo account", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addDemo });

                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addAccount;
                    expect(res.status).equal(200);
                    expect(data.id).equal(3);

                    resolve();
                });

            });            
        };


        insertBasic().then(insertAdmin()).then(insertDemo());
    });

    describe("Update", async () => {
        const update = `mutation { updateAccount(id: 1, firstname: "${basic.firstname} - updated", lastname: "${basic.lastname}", email: "${basic.email}", roleid: ${basic.roleId})
            {firstname}
        }`;

        it("Updates basic account", async () => {
            const res = await request(app).post("/api").send({ query: update });

            const data = JSON.parse(res.text).data.updateAccount;
            expect(res.status).equal(200);
            expect(data.firstname).equal(`${basic.firstname} - updated`);
        });
    });

    describe("Delete", async () => {
        const query = `mutation { deleteAccount(id: 3) {id} }`;

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
