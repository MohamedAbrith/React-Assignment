import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $password: String!) {
    registerUser(username: $username, password: $password) {
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
    }
  }
`;

export const ADD_RECIPE = gql`
  mutation AddRecipe($title: String!, $ingredients: String!, $instructions: String!, $category: String!) {
    addRecipe(title: $title, ingredients: $ingredients, instructions: $instructions, category: $category) {
      id
      title
      category
      ingredients
      instructions
    }
  }
`;

export const EDIT_RECIPE = gql`
  mutation editRecipe($id: ID!, $title: String, $category: String, $ingredients: String, $instructions: String) {
    editRecipe(id: $id, title: $title, category: $category, ingredients: $ingredients, instructions: $instructions) {
      id
      title
      category
      ingredients
      instructions
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateReceipe($id: ID, $title: String, $category: String, $Ingredients: String, $instructions: String) {
    updateRecipe(id: $id, title: $title, category: $category, ingredients: $ingredients, type: $type) {
      id
      title
      category
      ingredients
      instructions
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id){
    id
    }
  }
`;