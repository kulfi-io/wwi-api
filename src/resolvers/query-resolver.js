const {
    GraphQLObjectType,
    GraphQLString,
} = require("graphql");
const {AccountType} = require("../types/account-type");
const { RoleType } = require("../types/role-type");

const Query = new GraphQLObjectType({
    name: "RootQuery",
    type: "Query",
    fields: () => ({
        health: {
            type: GraphQLString,
            resolve: () => "I am alive!",
        },
        accounts: AccountType.query.all(),
        account: AccountType.query.one(),
        roles: RoleType.query.all(),
        role: RoleType.query.one()
    })
});

exports.query = Query;
