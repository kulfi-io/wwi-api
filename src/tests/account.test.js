import util from 'util';
import requestPromise from 'request-promise';
import { exec } from 'child_process'

const execPromisify = util.promisify(exec);
const API = "http://localhost:4000/api/";

describe("account query", () => {
    test("accounts query return results", async () => {
        const query = `query {accounts {accountid, firstname, lastname, email, verified, 
            role {roleid, display, description}}
        }`;

        const response = await requestPromise({
            method: "GET",
            uri: API,
            body: { query },
            json: true,
        });
        
        
    });
});
