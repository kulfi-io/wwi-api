const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} = graphql;
const { db } = require("../pg-adapter");

const Model = new GraphQLObjectType({
    name: "Role",
    type: "Query",
    fields: {
        roleid: { type: GraphQLInt },
        display: { type: GraphQLString },
        description: { type: GraphQLString },
    },
});

const All = () => ({
    type: new GraphQLList(Model),
    resolve: async (input) => {
        const query = `SELECT r.roleId, r.display, r.description 
                FROM wwi.role r 
                ORDER BY r.display`;

        return db
            .many(query)
            .then((res) => res)
            .catch((err) => err);
    },
});
const ById = () => ({
    type: Model,
    args: { roleId: { type: GraphQLNonNull(GraphQLID) } },
    resolve: async (input, args) => {
        const query = `SELECT roleId, display, description 
                FROM wwi.role WHERE roleId =  $1
                ORDER BY display`;

        const values = [args.roleId];

        return db
            .one(query, values)
            .then((res) => res)
            .catch((err) => err);
    },
});

const Add = () => ({
    type: Model,
    args: {
        display: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (input, args) => {
        const query = `INSERT INTO wwi.role(display, description) 
        VALUES($1, $2) RETURNING roleId`;

        const values = [args.display, args.description];

        return db
            .oneOrNone(query, values)
            .then((res) => res)
            .catch((err) => err);
    },
});

const Update = () => ({
    type: Model,
    args: {
        roleId: { type: GraphQLNonNull(GraphQLInt) },
        display: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (input, args) => {
        const query = `UPDATE wwi.role 
        SET display = $1, description = $2 
        WHERE roleId = $3`;

        const values = [args.display, args.description, args.roleId];

        return db
            .oneOrNone(query, values)
            .then((res) => res)
            .catch((err) => err);
    },
});

const Delete = () => ({
    type: Model,
    args: {
        roleId: { type: GraphQLNonNull(GraphQLInt) },
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

exports.RoleType = {
    model: Model,
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