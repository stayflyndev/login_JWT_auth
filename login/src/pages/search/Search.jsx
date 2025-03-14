import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_");

const Search = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("paymentSuccess") === "true") {
      setPaymentSuccess(true);
      localStorage.setItem("hasPaid", "true");
      window.history.replaceState({}, document.title, "/search");

      setTimeout(() => {
        const savedQuery = localStorage.getItem("query");
        if (savedQuery) {
          setQuery(savedQuery); // Set the query state
          handleSearch(savedQuery); // Trigger search immediately
        } else {
          console.error("Saved query not found in localStorage.");
        }
      }, 100);
    } else {
        const savedQuery = localStorage.getItem("query");
        if(savedQuery){
            setQuery(savedQuery);
            if(paymentSuccess === true){
                handleSearch(savedQuery);
            }
        }
    }
  }, [navigate, location, paymentSuccess]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery || query}`);
      console.log("API Response:", response.data);

      if (response.data.meals && response.data.meals.length > 0) {
        if (!paymentSuccess) {
          setShowPayment(true);
          setResults([]);
        } else {
          setResults(response.data.meals);
          setShowPayment(false);
        }
      } else {
        setResults([]);
        setShowPayment(false);
      }
    } catch (err) {
      console.error("Error fetching results", err);
      setResults([]);
      setShowPayment(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const stripe = await stripePromise;

    try {
      const token = localStorage.getItem("token");
      localStorage.setItem("query", query);
      const response = await axios.post("http://localhost:3001/api/payment/session", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { sessionId } = response.data;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div>
      <h2>Search API</h2>
      <input type="text" placeholder="Enter query" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => handleSearch()}>Search</button>

      {showPayment && !paymentSuccess && (
        <div>
          <p>Results are locked. Pay $5 to unlock!</p>
          <button onClick={handlePayment}>Pay $5</button>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <ul>
          {results.map((item, index) => (
            <li key={index}>{item.strMeal}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;