const express = require("express");
const graphQl = require('graphql');
const expressGraphQl = require('express-graphql');
const { GraphQLSchema } = graphQl;
const { query } = require('./resolvers/query-resolver');
const { mutation } = require('./resolvers/mutation-resolver');

const schema = new GraphQLSchema({
    query,
    mutation
});

const app = express();

app.use(
    "/api",
    expressGraphQl({
        schema: schema,
        graphiql: true
    })
);

app.get("/", (req, res) => {
    res.send("Express is working!");
});

app.listen(4000, () => {
    console.log("Listening on port 4000");
});
