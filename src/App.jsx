
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LevelDashboard from "./components/LevelDashboard/LevelDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/Lvl-Dashboard"
                    element={<LevelDashboard />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
