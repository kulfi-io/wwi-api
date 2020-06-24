import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getUser } from "./util/index.js";

import { schema } from "./resolvers/index.js";
import expressGraphQl from "express-graphql";

const app = express();

app.use("/api", bodyParser.json());
app.use("/api", cors(), (req, res) => {
    const _user = getUser(req.headers);

    expressGraphQl({
        schema: schema,
        graphiql: false,
        context: { user: _user },
    })(req, res);
});

app.get("/", (req, res) => {
    res.send("Express is working!");
});

const server = app.listen(4000, () => {
    console.log("Listening on port 4000");
});

export default server;
