import * as grapql from "graphql";
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
            resolve: async (input, args, context) => {
                const query = `SELECT c.id, c.display, c.description 
                        FROM wwi.claim c 
                        ORDER BY c.display`;

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
                const query = `SELECT id, display, description 
                        FROM wwi.claim WHERE id =  $1
                        ORDER BY display`;
    
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
                display: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (input, args, context) => {
                const query = `INSERT INTO wwi.claim(display, description) 
                VALUES($1, $2) RETURNING id`;
    
                const values = [args.display, args.description];
                
                if (!isAuthenticAdmin(context.user)) throw new Error("Unauthorized");

                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        }),

    }
    
}

export default new ClaimType();
