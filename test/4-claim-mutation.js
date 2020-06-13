import mocha from "mocha";
import chai from "chai";
import request from "supertest";
import app from "../src/index.js";
import { generateSeederToken } from "../src/util/index.js";

const { describe, it } = mocha;
const { expect } = chai;

const _token = generateSeederToken();

describe("Claim Mutations", () => {
    const view = {
        display: "View Claim",
        description: "Only allows to read data",
    };

    const add = {
        display: "Add Claim",
        description: "Allows to write data",
    };

    const update = {
        display: "Update Claim",
        description: "Allows to update data",
    };

    const remove = {
        display: "Delete Claim",
        description: "Allows to delete data",
    };

    describe("Add claims", async () => {
        const _view = `mutation { addClaim(display: "${view.display}", description: "${view.description}")
            {id}
        }`;

        const _add = `mutation { addClaim(display: "${add.display}", description: "${add.description}")
            {id}
        }`;

        const _update = `mutation { addClaim(display: "${update.display}", description: "${update.description}")
            {id}
        }`;

        const _remove = `mutation { addClaim(display: "${remove.display}", description: "${remove.description}")
            {id}
        }`;

        let res, data;

        it("adds view claim", async () => {
            res = await request(app)
                .post("/api")
                .set({ Authorization: _token })
                .send({ query: _view });

            data = JSON.parse(res.text).data.addClaim;
            expect(res.status).equal(200);
            expect(data.id).equal(1);
        });

        it("adds write claim", async () => {
            res = await request(app)
                .post("/api")
                .set({ Authorization: _token })
                .send({ query: _add });

            data = JSON.parse(res.text).data.addClaim;
            expect(res.status).equal(200);
            expect(data.id).equal(2);
        });

        it("adds update claim", async () => {
            res = await request(app)
                .post("/api")
                .set({ Authorization: _token })
                .send({ query: _update });

            data = JSON.parse(res.text).data.addClaim;
            expect(res.status).equal(200);
            expect(data.id).equal(3);
        });

        it("adds delete claim", async () => {
            res = await request(app)
                .post("/api")
                .set({ Authorization: _token })
                .send({ query: _remove });

            data = JSON.parse(res.text).data.addClaim;
            expect(res.status).equal(200);
            expect(data.id).equal(4);
        });
    });
});
