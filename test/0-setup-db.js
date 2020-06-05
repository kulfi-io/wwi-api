import mocha from "mocha";
import chai from "chai";
import { db } from "../src/pg-adapter.js";

const { describe, it } = mocha;
const { expect } = chai;
const salt = 10;

describe("Database", () => {
    describe("Clean role and account", () => {
        it("clean", () => {
            const truncate = `TRUNCATE wwi.account, wwi.role 
            RESTART IDENTITY`;

            db.query(truncate)
            .then((res) => {
                expect(res).to.be.an("array");
                expect(res.length).equal(0);
            });
            
        });
    });
});
