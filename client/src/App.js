import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import NotFound from "./NotFound";
import OrderForm from "./OrderForm";
import OrdersList from "./OrdersList";
import React, { useState } from "react";

export const Context = React.createContext();

function App() {
  const [userData, setUserData] = useState();

  return (
    <Router>
      <Context.Provider value={[userData, setUserData]}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Context.Provider>
    </Router>
  );
}

export default App;
