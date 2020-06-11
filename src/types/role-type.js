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

export class RoleType {
    
    model = new GraphQLObjectType({
        name: "Role",
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
                const query = `SELECT r.id, r.display, r.description 
                        FROM wwi.role r 
                        ORDER BY r.display`;
    
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
                        FROM wwi.role WHERE id =  $1
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
                const query = `INSERT INTO wwi.role(display, description) 
                VALUES($1, $2) RETURNING id`;
    
                const values = [args.display, args.description];
    
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
                display: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (input, args) => {
                const query = `UPDATE wwi.role 
                SET display = $1, description = $2 
                WHERE id = $3 RETURNING display`;
    
                const values = [args.display, args.description, args.id];
    
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
            resolve: async (input, args) => {
                const query = `DELETE FROM wwi.role 
                WHERE id = $1`;
    
                const values = [args.id];
    
                return db
                    .oneOrNone(query, values)
                    .then((res) => res)
                    .catch((err) => err);
            },
        })

    }
    
}

export default new RoleType();
