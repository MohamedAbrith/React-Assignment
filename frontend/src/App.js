import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';



import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import RecipeForm from './components/ReceipeForm';


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path = "/signup" element={<SignUp/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recipes/add" element={<RecipeForm />} />
          <Route path="/recipes/edit/:id" element={<RecipeForm />} />
          <Route path="/" element={<SignIn />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
