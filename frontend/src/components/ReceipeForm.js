
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_RECIPE, EDIT_RECIPE } from '../graphql/mutations';
import { GET_DASHBOARD_DATA, GET_RECIPE_BY_ID } from '../graphql/queries';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/ReceipeForm.css';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); 

  // Query for fetching the recipe if editing
  const { data, loading, error } = useQuery(GET_RECIPE_BY_ID, {
    variables: { id },
    skip: !id, // Skip query if no id
  });

  useEffect(() => {
    if (data && data.getRecipeById) {
      const { title, category, ingredients, instructions } = data.getRecipeById;
      setTitle(title);
      setCategory(category);
      setIngredients(ingredients);
      setInstructions(instructions);
    }
  }, [data]);

  const [addRecipe] = useMutation(ADD_RECIPE, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA }] 
  });

  const [editRecipe] = useMutation(EDIT_RECIPE, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA }] 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await editRecipe({
          variables: { id, title, category, ingredients, instructions },
        });
      } else {
        await addRecipe({
          variables: { title, category, ingredients, instructions },
        });
      }
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard'); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <h2>{id ? 'Edit Recipe' : 'Add Recipe'}</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="Breakfast">Breakfast</MenuItem>
            <MenuItem value="Lunch">Lunch</MenuItem>
            <MenuItem value="Dinner">Dinner</MenuItem>
            <MenuItem value="Dessert">Dessert</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={6}
        />
        <div className="button-group">
          <Button type="submit" variant="contained" color="primary">
            {id ? 'Update' : 'Add'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancel}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;

