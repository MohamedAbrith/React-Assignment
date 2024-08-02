import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    totalRecipes
    categories
    getRecipes{
      id
      title
      category
      ingredients
      instructions
    }
  }
`;

export const GET_RECIPES = gql`
  query GetRecipes {
    getRecipes {
      title
      category
      ingredients
      instructions
    }
  }
`;

export const GET_RECIPE_BY_ID = gql`
  query GetRecipeById($id: ID!) {
    getRecipeById(id: $id) {
      id
      title
      category
      ingredients
      instructions
    }
  }
`;
