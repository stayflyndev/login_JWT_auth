import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Login from "./pages/login/Login.jsx";
import Search from "./pages/search/Search.jsx";

function App() {
  //funct to check auth or not
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
    <Router>
      <Routes>
      <Route path="/" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/search" />} />
        <Route path="/search" element={isAuthenticated ? <Search /> : <Navigate to="/" />} />
      </Routes>
      </Router>
    </>
  )
}

export default App
