
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Recipe {
    id: ID!
    title: String!
    category: String!
    ingredients: String!
    instructions: String!
  }

  type User {
    id: ID!
    username: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    totalRecipes: Int!
    getRecipes: [Recipe!]!
    getRecipeById(id: ID!): Recipe
    categories: [String!]!
  }

  type Mutation {
    addRecipe(title: String!, category: String!, ingredients: String!, instructions: String!): Recipe!
    deleteRecipe(id: ID!): Recipe!
    editRecipe(id: ID!, title: String, category: String, ingredients: String, instructions: String): Recipe!
    updateRecipe(id: ID!, title: String, category: String, ingredients: String, instructions: String): Recipe
    registerUser(username: String!, password: String!): AuthPayload!
    loginUser(username: String!, password: String!): AuthPayload!
  }
`;

module.exports = typeDefs;



