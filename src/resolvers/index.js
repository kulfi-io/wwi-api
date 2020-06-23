import * as graphql from "graphql";
import { Query } from "./query-resolver.js";
import { Mutation } from "./mutation-resolver.js";

export const schema = new graphql.GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export default schema;
 