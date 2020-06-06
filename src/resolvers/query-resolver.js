import graphql from 'graphql';
import AccountType  from '../types/account-type.js';
import RoleType from "../types/role-type.js";

const {GraphQLObjectType, GraphQLString} = graphql;

export const Query = new GraphQLObjectType({
    name: "RootQuery",
    type: "Query",
    fields: () => ({
        health: {
            type: GraphQLString,
            resolve: () => "I am alive!",
        },
        accounts: AccountType.queries.all(),
        accountSearch: AccountType.queries.search(),
        account: AccountType.queries.byId(),
        login: AccountType.queries.login(),
        roles: RoleType.queries.all(),
        role: RoleType.queries.byId()
        
    }),
});

export default Query;

