
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LevelDashboard from "./components/LevelDashboard/LevelDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LevelDashboard />}
                />

                <Route
                    path="/Lvl-Dashboard"
                    element={<LevelDashboard />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
