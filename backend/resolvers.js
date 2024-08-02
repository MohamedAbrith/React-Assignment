const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const User = require('./models/User');
const Recipe = require('./models/Recipe');

const checkAuth = (user) => {
  if (!user) {
    throw new Error('Authentication required');
  }
};

const resolvers = {
  Query: {
    totalRecipes: async (_, __, { user }) => {
      checkAuth(user);
      try {
        const count = await Recipe.countDocuments();
        return count;
      } catch (error) {
        throw new Error('Error fetching total recipes: ' + error.message);
      }
    },
    getRecipes: async (_, __, { user }) => {
      checkAuth(user);
      try {
        const recipes = await Recipe.find();
        return recipes;
      } catch (error) {
        throw new Error('Error fetching recipes: ' + error.message);
      }
    },
    getRecipeById: async (_, { id }, { user }) => {
      checkAuth(user);
      try {
        const recipe = await Recipe.findById(id);
        return recipe;
      } catch (error) {
        throw new Error('Error fetching recipe: ' + error.message);
      }
    },
    categories: async (_, __, { user }) => {
      checkAuth(user);
      try {
        const categories = await Recipe.distinct('category');
        return categories;
      } catch (error) {
        throw new Error('Error fetching categories: ' + error.message);
      }
    },
  },
  Mutation: {
    addRecipe: async (_, { title, ingredients, instructions, category }, { user }) => {
      checkAuth(user);
      const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
        category,
      });
      return await newRecipe.save();
    },
    deleteRecipe: async (_, { id }, { user }) => {
      checkAuth(user);
      const result = await Recipe.findByIdAndDelete(id);
      return result;
    },
    editRecipe: async (_, { id, title, ingredients, instructions, category }, { user }) => {
      checkAuth(user);
      const updateFields = {};
      if (title) updateFields.title = title;
      if (ingredients) updateFields.ingredients = ingredients;
      if (instructions) updateFields.instructions = instructions;
      if (category) updateFields.category = category;

      return await Recipe.findByIdAndUpdate(id, updateFields, { new: true });
    },

    registerUser: async (_, { username, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);

      return {
        token,
        user: savedUser,
      };
    },
    loginUser: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Incorrect password');
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return {
        token,
        user,
      };
    },
  },
};

module.exports = resolvers;



