import graphql from 'graphql';
import AccountType from "../types/account-type.js";
import RoleType from "../types/role-type.js";
import ClaimType from "../types/claim-type.js";

export const Mutation = new graphql.GraphQLObjectType({
    name: "RootMutation",
    type: "Mutation",
    fields: () => ({
        addAccount: AccountType.mutations.add(),
        updateAccount: AccountType.mutations.update(),
        deleteAccount: AccountType.mutations.delete(),
        addRole: RoleType.mutations.add(),
        updateRole: RoleType.mutations.update(),
        deleteRole: RoleType.mutations.delete(),
        addClaim: ClaimType.mutations.add(),
        updateClaim: ClaimType.mutations.update(),
        deleteClaim: ClaimType.mutations.delete()
    }),
});

export default Mutation;
