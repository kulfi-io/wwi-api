import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";

const { describe, it } = mocha;
const { expect } = chai;


describe("Claim Mutations", () => {
    const view = {
        roleid: 1,
        claimid: 1,
    };

    const add = {
        roleid: 1,
        claimid: 2,
    };

    const update = {
        roleid: 1,
        claimid: 3,
    };

   

    describe("Add Basic Role Claim", async () => {
        const _view = `mutation { addRoleClaim(roleid: ${view.roleid}, claimid: ${view.claimid})
            {id}
        }`;

        const _add = `mutation { addRoleClaim(roleid: ${add.roleid}, claimid: ${add.claimid})
            {id}
        }`;

        const _update = `mutation { addRoleClaim(roleid: ${update.roleid}, claimid: ${update.claimid})
            {id}
        }`;


        let res, data;

        it("adds basic view role claim", async () => {
            res = await request(app).post("/api").send({ query: _view });

            data = JSON.parse(res.text).data.addRoleClaim;
            expect(res.status).equal(200);
            expect(data.id).equal(1);

        });

        it("adds basic add role claim", async () => {
            res = await request(app).post("/api").send({ query: _add });

            data = JSON.parse(res.text).data.addRoleClaim;
            expect(res.status).equal(200);
            expect(data.id).equal(2);

        });

        it("adds basic update role claim", async () => {
            res = await request(app).post("/api").send({ query: _update });

            data = JSON.parse(res.text).data.addRoleClaim;
            expect(res.status).equal(200);
            expect(data.id).equal(3);

        });
        
        it("adds basic view role claim generates error for existing role and claim", async () => {
            res = await request(app).post("/api").send({ query: _view });

            expect(res.error);

        });
    });

});
