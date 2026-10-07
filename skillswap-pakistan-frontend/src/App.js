// src/App.js
import React from 'react';
// HomePage is no longer directly rendered here, routing handles it
// import HomePage from './components/HomePage';

function App() {
  return (
    <div className="app-container"> {/* Using a generic class name */}
      {/* Content will be rendered by react-router-dom based on the route */}
    </div>
  );
}

export default App;