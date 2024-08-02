
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import { DELETE_RECIPE } from '../graphql/mutations';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Dashboard.css';
import Button from '@mui/material/Button';

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);
  const navigate = useNavigate();

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { totalRecipes, getRecipes } = data;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleEdit = (id) => {
    navigate(`/recipes/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipe({ variables: { id } });
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  
  const filteredRecipes = getRecipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="recipe-dashboard-container">
      <div className="top-bar">
        <h2>Recipe Dashboard</h2>
        <div className="top-bar-buttons">
          <Link to="/recipes/add" className="add-recipe-button">Add New Recipe</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <h3>Total Recipes: {totalRecipes}</h3>
      <div className="filter-section">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
        </select>
        <label htmlFor="search-bar">Search:</label>
        <input
          id="search-bar"
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="recipe-list-section">
        <h3>Recipe List</h3>
        <ul>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <li key={recipe.id}>
                <p><em>Title:</em> {recipe.title}</p>
                <p><em>Category:</em> {recipe.category}</p>
                <p><em>Ingredients:</em> {recipe.ingredients}</p>
                <p><em>Instructions:</em> {recipe.instructions}</p>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEdit(recipe.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </Button>
              </li>
            ))
          ) : (
            <p>No recipes available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

