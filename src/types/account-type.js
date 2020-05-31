const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
} = graphql;
const { RoleType } = require("./role-type");
const { db } = require("../pg-adapter");

const Account = new GraphQLObjectType({
    name: "Account",
    type: "Query",
    fields: {
        accountid: { type: GraphQLInt },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        verified: { type: GraphQLBoolean },
        role: {
            type: RoleType.model
        },
    },
});

const All = () => ({
    type: new GraphQLList(Account),
    resolve: async (input) => {
        const query = `SELECT a.accountId, a.firstName, a.lastName,
        a.email, a.verified, r.roleId, r.display, r.description
        FROM wwi.account a INNER JOIN wwi.role r
        ON a.roleId = r.roleId`;

        return db
            .any(query)
            .then((res) => {
                let result = [];

                res.forEach((item) => {
                    const _item = {
                        accountid: item.accountid,
                        firstname: item.firstname,
                        lastname: item.lastname,
                        email: item.email,
                        verified: item.verified,
                        role: {
                            roleid: item.roleid,
                            display: item.display,
                            description: item.description,
                        },
                    };

                    result.push(_item);
                });

                return result;
            })
            .catch((err) => err);
    },
});

const ById = () =>  ({
    type: Account,
    args: { accountId: { type: GraphQLNonNull(GraphQLID) } },
    resolve: async (input, args) => {
        const query = `SELECT a.accountId, a.firstName, a.lastName,
        a.email, a.verified, r.roleId, r.display, r.description
        FROM wwi.account a INNER JOIN wwi.role r
        ON a.roleId = r.roleId
        WHERE accountId =  $1`;
        const values = [args.accountId];

        return db
            .one(query, values)
            .then((res) => {
                if (res) {
                    const result = {
                        accountid: res.accountid,
                        firstname: res.firstname,
                        lastname: res.lastname,
                        email: res.email,
                        verified: res.verified,
                        role: {
                            roleid: res.roleid,
                            display: res.display,
                            description: res.description,
                        },
                    };

                    return result;
                }

                return res;
            })
            .catch((err) => err);
    },
});

const Add = () => ({
    type: Account,
    args: {
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        roleId: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (input, args) => {
        const query = `INSERT INTO wwi.account(firstName, lastName, email, roleId) 
        VALUES($1, $2, $3, $4) RETURNING accountId`;

        const values = [args.firstName, args.lastName, args.email, args.roleId];

        return db
            .oneOrNone(query, values)
            .then((res) => res)
            .catch((err) => err);
    },
});

const Update = () => ({
    type: Account,
    args: {
        accountId: { type: GraphQLNonNull(GraphQLInt) },
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        roleId: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (input, args) => {
        const query = `UPDATE wwi.account 
        SET firstName = $1, lastName = $2, email = $3, roleId = $4 
        WHERE accountId = $5`;

        const values = [
            args.firstName,
            args.lastName,
            args.email,
            args.roleId,
            args.accountId,
        ];

        return db
            .oneOrNone(query, values)
            .then((res) => res)
            .catch((err) => err);
    },
});

const Delete = () => ({
    type: Account,
    args: {
        accountId: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (input, args) => {
        const query = `DELETE FROM wwi.account 
        WHERE accountId = $1`;

        const values = [args.accountId];

        return db
            .oneOrNone(query, values)
            .then((res) => res)
            .catch((err) => err);
    },
});

exports.AccountType = {
    model: Account,
    query: {
        all: All,
        one: ById,
    },
    mutation: {
        add: Add,
        update: Update,
        delete: Delete,
    },
};
