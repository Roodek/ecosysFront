import React from 'react';
import '../stylesheets/MainPage.css';
import GamesListPage from "./GamesListPage";
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import GamePage from "./GamePage"; // Assuming a CSS file for styling

const MainPage = () => {
    return (
        <div className="container">
            {/* Navbar */}
            <Router>
            <nav className="navbar">
                <h1 className="navbar-title">Synergies</h1>
                <ul className="navbar-menu">
                    <NavLink className="navbar-element" to="/">Home</NavLink>
                    <NavLink className="navbar-element" to="/about">About</NavLink>
                </ul>
            </nav>
            {/* Main content with centered buttons */}
            {/*<main className="main-content">*/}
            {/*    <button className="action-button">Button 1</button>*/}
            {/*    <button className="action-button">Button 2</button>*/}
            {/*</main>*/}
            <div className="content">
                <Routes>
                    <Route path="/" element={<GamesListPage/>}/>
                    <Route path="/game" element={<GamePage/>}/>
                </Routes>
            </div>
            </Router>
        </div>
    );
};

export default MainPage;