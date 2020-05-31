const graphql = require("graphql");
const {
    GraphQLObjectType,
} = graphql;
const { AccountType } = require("../types/account-type");
const { RoleType } = require("../types/role-type");

const Mutation = new GraphQLObjectType({
    name: "RootMutation",
    type: "Mutation",
    fields: () => ({
        addAccount: AccountType.mutation.add(),
        updateAccount: AccountType.mutation.update(),
        deleteAccount: AccountType.mutation.delete(),
        addRole: RoleType.mutation.add(),
        updateRole: RoleType.mutation.update(),
        deleteRole: RoleType.mutation.delete()
    }),
});

exports.mutation = Mutation;
