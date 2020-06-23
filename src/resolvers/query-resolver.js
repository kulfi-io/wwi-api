import * as graphql from 'graphql';
import AccountType  from '../types/account-type.js';
import RoleType from "../types/role-type.js";
import ClaimType from "../types/claim-type.js";
import RoleClaimType from "../types/role-claim-type.js";

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
        role: RoleType.queries.byId(),
        claims: ClaimType.queries.all(),
        claim: ClaimType.queries.byId(),
        roleClaims: RoleClaimType.queries.all(),
        roleClaim: RoleClaimType.queries.byId()
    }),
});

export default Query;

