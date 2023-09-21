import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../Login/login.jsx";
import HomePage from "../home/home.jsx";
import ProtectedRoute from "./protectedRoute.jsx";

function MainRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const storedAccessToken = localStorage.getItem("accessToken");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />

        {storedAccessToken ? (
          <Route index element={<HomePage />} />
        ) : (
          <Route
            path="/"
            element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
          >
            <Route index element={<HomePage />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
