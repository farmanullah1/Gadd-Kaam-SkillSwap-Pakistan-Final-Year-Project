// src/App.js
import React from 'react';
import HomePage from './components/HomePage';
import './App.css'; // Make sure this line is present to import App.css

function App() {
  return (
    <div className="app-container"> {/* Using a generic class name */}
      <HomePage />
    </div>
  );
}

export default App;