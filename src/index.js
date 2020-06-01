import express from "express";
import expressGraphQl from "express-graphql";
import graphql from "graphql";
import { Query } from "./resolvers/query-resolver.js";
import { Mutation } from "./resolvers/mutation-resolver.js";

const schema = new graphql.GraphQLSchema({
    query: Query,
    mutation: Mutation,
});

const app = express();

app.use(
    "/api",
    expressGraphQl({
        schema: schema,
        graphiql: true,
    })
);

app.get("/", (req, res) => {
    res.send("Express is working!");
});

app.listen(4000, () => {
    console.log("Listening on port 4000");
});
