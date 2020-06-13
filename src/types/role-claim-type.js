import grapql from "graphql";
import { db } from "../pg-adapter.js";
import { isAuthenticAdmin } from "../util/index.js";

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} = grapql;

export class RoleClaimType {
    
    model = new GraphQLObjectType({
        name: "RoleClaim",
        type: "Query",
        fields: {
            id: { type: GraphQLInt },
            role: { type: GraphQLString },
            claim: { type: GraphQLString },
        },
    });

    queries = {
        all: () => ({
            type: new GraphQLList(this.model),
            resolve: async (input, args, context) => {
                const query = `SELECT rc.id, r.display as role, c.display as claim 
                        FROM wwi.role_claim rc INNER JOIN  wwi.role r
                            ON rc.roleid = r.id INNER JOIN wwi.claim c
                            ON rc.claimid = c.id
                        ORDER BY r.display`;
    
                if (!isAuthenticAdmin(context.user)) throw new Error("Unauthorized");

                return db
                    .many(query)
                    .then((res) => res)
                    .catch((err) => err);
            },
        }),
    
        byId: () => ({
            type: this.model,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: async (input, args, context) => {
                const query = `SELECT rc.id, r.display as role, c.display as claim 
                FROM wwi.role_claim rc INNER JOIN  wwi.role r
                    ON rc.roleid = r.id INNER JOIN wwi.claim c
                    ON rc.claimid = c.id
                WHERE rc.id = $1 
                ORDER BY r.display`;
    
                const values = [args.id];

                if (!isAuthenticAdmin(context.user)) throw new Error("Unauthorized");

    
                return db
                    .one(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        })
    }

    
    mutations = {
        add: () => ({
            type: this.model,
            args: {
                roleid: { type: GraphQLNonNull(GraphQLInt) },
                claimid: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (input, args, context) => {
                const query = `INSERT INTO wwi.role_claim(roleid, claimid) 
                VALUES($1, $2) RETURNING id`;
    
                const values = [args.roleid, args.claimid];

                if (!isAuthenticAdmin(context.user)) throw new Error("Unauthorized");

                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        }),
    
        delete: () => ({
            type: this.model,
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (input, args, context) => {
                const query = `DELETE FROM wwi.role_claim 
                WHERE id = $1`;
    
                const values = [args.claimid];

                if (!isAuthenticAdmin(context.user)) throw new Error("Unauthorized");

    
                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        })

    }
    
}

export default new RoleClaimType();
