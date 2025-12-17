import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../components/HomePage/HomePage';
import AckPage from '../components/AckPage/AckPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ack" element={<AckPage />} />
      </Routes>
    </div>
  );
}

export default App;

