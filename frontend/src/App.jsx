import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
