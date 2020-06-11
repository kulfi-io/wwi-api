import grapql from "graphql";
import { db } from "../pg-adapter.js";

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} = grapql;

export class ClaimType {
    
    model = new GraphQLObjectType({
        name: "Claim",
        type: "Query",
        fields: {
            id: { type: GraphQLInt },
            display: { type: GraphQLString },
            description: { type: GraphQLString },
        },
    });

    queries = {
        all: () => ({
            type: new GraphQLList(this.model),
            resolve: async (input) => {
                const query = `SELECT c.id, c.display, c.description 
                        FROM wwi.claim c 
                        ORDER BY c.display`;
    
                return db
                    .many(query)
                    .then((res) => res)
                    .catch((err) => err);
            },
        }),
    
        byId: () => ({
            type: this.model,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: async (input, args) => {
                const query = `SELECT id, display, description 
                        FROM wwi.claim WHERE id =  $1
                        ORDER BY display`;
    
                const values = [args.id];
    
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
                display: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (input, args) => {
                const query = `INSERT INTO wwi.claim(display, description) 
                VALUES($1, $2) RETURNING id`;
    
                const values = [args.display, args.description];
    
                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        }),
    
        // update: () => ({
        //     type: this.model,
        //     args: {
        //         claimid: { type: GraphQLNonNull(GraphQLInt) },
        //         display: { type: GraphQLNonNull(GraphQLString) },
        //         description: { type: GraphQLNonNull(GraphQLString) },
        //     },
        //     resolve: async (input, args) => {
        //         const query = `UPDATE wwi.claim 
        //         SET display = $1, description = $2 
        //         WHERE claimid = $3 RETURNING display`;
    
        //         const values = [args.display, args.description, args.roleId];
    
        //         return db
        //             .oneOrNone(query, values)
        //             .then((res) => res)
        //             .catch((err) => err);
        //     },
        // }),
    
        // delete: () => ({
        //     type: this.model,
        //     args: {
        //         claimid: { type: GraphQLNonNull(GraphQLInt) }
        //     },
        //     resolve: async (input, args) => {
        //         const query = `DELETE FROM wwi.claim 
        //         WHERE claimid = $1`;
    
        //         const values = [args.claimid];
    
        //         return db
        //             .oneOrNone(query, values)
        //             .then((res) => res)
        //             .catch((err) => err);
        //     },
        // })

    }
    
}

export default new ClaimType();
