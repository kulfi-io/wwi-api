import express from "express";
import expressGraphQl from "express-graphql";
import graphql from "graphql";
import bodyParser from "body-parser";
import cors from "cors";
import { getUser} from "./util/index.js";
import { Query } from "./resolvers/query-resolver.js";
import { Mutation } from "./resolvers/mutation-resolver.js";


const schema = new graphql.GraphQLSchema({
    query: Query,
    mutation: Mutation,
});

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
