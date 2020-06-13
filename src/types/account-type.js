import graphql from "graphql";
import RoleType from "./role-type.js";
import { db } from "../pg-adapter.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
} = graphql;

const salt = 10;


const validateAndGenerateToken = (args, result) => {

    const _model = {
        id: -1,
        fullname: null,
        token: null,
        message: null,
    };

    if(!result) return _model;

    if (!result.verified) {
        _model.message = "Please verify your registration";
        return _model;
    }

    const same = bcrypt.compareSync(args.password, result.password);

    if(!same) {
        _model.message = "Username password mistmatch";
        return _model;
    }

    const _items = result.items;
    const _email = result.email;

    const token = jwt.sign(
        {_email, _items},
        process.env.SECRET,
        {expiresIn: '1d'}
    );

    _model.id = result.id;
    _model.fullname = result.fullname;
    _model.token = token;

    return _model;

};

export class AccountType {
    model = new GraphQLObjectType({
        name: "Account",
        type: "Query",
        fields: {
            id: { type: GraphQLInt },
            firstname: { type: GraphQLString },
            lastname: { type: GraphQLString },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
            verified: { type: GraphQLBoolean },
            role: {
                type: RoleType.model,
            },
        },
    });


    loginModel = new GraphQLObjectType({
        name: "Login",
        type: "Query",
        fields: {
            id: { type: GraphQLInt },
            fullname: { type: GraphQLString },
            token: { type: GraphQLString },
            message: { type: GraphQLString },
        },
    });

    queries = {
        all: () => ({
            type: new GraphQLList(this.model),
            resolve: async (input) => {
                const query = `SELECT a.id, a.firstname, a.lastname,
                a.email, a.verified, a.roleid, r.display, r.description
                FROM wwi.account a INNER JOIN wwi.role r
                ON a.roleid = r.id 
                ORDER BY a.firstname`;

                return db
                    .any(query)
                    .then((res) => {
                        let result = [];

                        res.forEach((item) => {
                            const _item = {
                                id: item.id,
                                firstname: item.firstname,
                                lastname: item.lastname,
                                email: item.email,
                                verified: item.verified,
                                role: {
                                    id: item.roleid,
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
        }),

        search: () => ({
            type: new GraphQLList(this.model),
            args: { criteria: { type: GraphQLNonNull(GraphQLString) } },
            resolve: async (input, args) => {
                const query = `SELECT a.id, a.firstName, a.lastName, a.email, a.verified, a.roleId, r.display, r.description
                FROM wwi.account a INNER JOIN wwi.role r
                ON a.roleId = r.id 
                WHERE a.firstName LIKE $1 OR a.lastName LIKE $1 OR a.email LIKE $1
                ORDER BY a.firstName`;

                const values = [`%${args.criteria}%`];

                return db
                    .any(query, values)
                    .then((res) => {
                        let result = [];

                        res.forEach((item) => {
                            const _item = {
                                id: item.id,
                                firstname: item.firstname,
                                lastname: item.lastname,
                                email: item.email,
                                verified: item.verified,
                                role: {
                                    id: item.roleid,
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
        }),

        byId: () => ({
            type: this.model,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: async (input, args) => {
                const query = `SELECT a.id, a.firstname, a.lastname,
                a.email, a.verified, a.roleId, r.display, r.description
                FROM wwi.account a INNER JOIN wwi.role r
                ON a.roleId = r.id
                WHERE a.id =  $1 
                ORDER BY a.firstname`;

                const values = [args.id];

                return db
                    .one(query, values)
                    .then((res) => {
                        if (res) {
                            const result = {
                                id: res.id,
                                firstname: res.firstname,
                                lastname: res.lastname,
                                email: res.email,
                                verified: res.verified,
                                role: {
                                    id: res.roleid,
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
        }),

        login: () => ({
            type: this.loginModel,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (input, args) => {
                const query = `SELECT id, concat(firstname, ' ', lastname) as fullname,
                email, verified, password, wwi.get_account_claims($1) as items 
                FROM wwi.account 
                WHERE email = $1`

                const values = [args.email];

                return db
                    .one(query, values)
                    .then((res) => {
                        const result = validateAndGenerateToken(args, res);
                        return result;
                    })
                    .catch((err) => err);
            },
        }),
    };

    mutations = {
        add: () => ({
            type: this.model,
            args: {
                firstname: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                roleid: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (input, args) => {
                const query = `INSERT INTO wwi.account(firstname, lastname, email, password, roleid) 
                VALUES($1, $2, $3, $4, $5) RETURNING id`;

                if (
                    !args.firstname ||
                    !args.lastname ||
                    !args.password ||
                    !args.email ||
                    !args.roleid
                ) {
                    throw new Error("Invalid data");
                }

                const values = [
                    args.firstname,
                    args.lastname,
                    args.email,
                    bcrypt.hashSync(args.password, salt),
                    args.roleid,
                ];

                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        }),

        update: () => ({
            type: this.model,
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                firstname: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                roleid: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (input, args) => {
                const query = `UPDATE wwi.account 
                SET firstname = $1, lastname = $2, email = $3, roleid = $4 
                WHERE id = $5 RETURNING firstname`;

                const values = [
                    args.firstname,
                    args.lastname,
                    args.email,
                    args.roleid,
                    args.id,
                ];

                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        }),

        delete: () => ({
            type: this.model,
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (input, args) => {
                const query = `DELETE FROM wwi.account 
                WHERE id = $1`;

                const values = [args.id];

                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        }),

        verify: () => ({
            type: this.model,
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                verified: { type: GraphQLNonNull(GraphQLBoolean) },
            },
            resolve: async (input, args) => {
                const query = `UPDATE wwi.account 
                SET verified = $2
                WHERE id = $1 RETURNING id`;

                const values = [
                    args.id, args.verified
                ];

                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        })
    };
}

export default new AccountType();
