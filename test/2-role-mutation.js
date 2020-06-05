import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";

const { describe, it } = mocha;
const { expect } = chai;

describe("Role Mutations", () => {
    const basic = {
        display: "Basic User",
        description: "Default user with basic privileges",
    };

    const admin = {
        display: "Admin User",
        description: "User with elevated privileges",
    };

    const demo = {
        display: "Demo User",
        description: "User with view only privilege",
    };

    describe("Add", async () => {
        const addBasic = `mutation { addRole(display: "${basic.display}", description: "${basic.description}")
            {roleid}
        }`;

        const addAdmin = `mutation { addRole(display: "${admin.display}", description: "${admin.description}")
            {roleid}
        }`;

        const addDemo = `mutation { addRole(display: "${demo.display}", description: "${demo.description}")
            {roleid}
        }`;

        let res, data;

        const insertBasic = () => {
            return new Promise((resolve, reject) => {
                it("adds basic role", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addBasic });

                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addRole;
                    expect(res.status).equal(200);
                    expect(data.roleid).equal(1);

                    resolve();
                });

            });            
        };

        const insertAdmin = () => {
            return new Promise((resolve, reject) => {
                it("adds admin role", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addAdmin });

                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addRole;
                    expect(res.status).equal(200);
                    expect(data.roleid).equal(2);

                    resolve();
                });

            });            
        };

        const insertDemo = () => {
            return new Promise((resolve, reject) => {
                it("adds demo role", async () => {
                    res = await request(app)
                        .post("/api")
                        .send({ query: addDemo });

                    if(res.err) reject();
        
                    data = JSON.parse(res.text).data.addRole;
                    expect(res.status).equal(200);
                    expect(data.roleid).equal(3);

                    resolve();
                });

            });            
        };

        insertBasic().then(insertAdmin()).then(insertDemo());

    });

    describe("Update", async () => {
        const update = `mutation { updateRole(roleId: 1, display: "${basic.display} - updated", description: "${basic.description}")
            {display}
        }`;

        it("Updates basic role", async () => {
            const res = await request(app).post("/api").send({ query: update });

            const data = JSON.parse(res.text).data.updateRole;
            expect(res.status).equal(200);
            expect(data.display).equal(`${basic.display} - updated`);
        });
    });

    describe("Delete", async () => {
        const query = `mutation { deleteRole(roleId: 3) {roleid} }`;

        it("Delete demo role", async () => {
            const res = await request(app).post("/api").send({ query: query });

            expect(res.status).equal(200);
        });

        it("Delete with invalid id generates error", async () => {
            const res = await request(app).post("/api").send({ query: query });

            expect(res.error);
        });
    });
});
