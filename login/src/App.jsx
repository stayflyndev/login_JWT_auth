import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login.jsx";
import Search from "./pages/search/Search.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null for initial state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Convert token to boolean
    setLoading(false); // Set loading to false after check
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ element, ...rest }) => {
    if (loading) {
      return <div>Loading...</div>; // Show loading indicator
    }
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated === false ? (
              <Login setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/search" />
            )
          }
        />
        <Route
          path="/search"
          element={<ProtectedRoute element={<Search />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
