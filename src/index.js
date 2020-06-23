import express from "express";
import expressGraphQl from "express-graphql";
import bodyParser from "body-parser";
import cors from "cors";
import { schema } from "./resolvers/index.js";
import { getUser } from "./util/index.js";

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
