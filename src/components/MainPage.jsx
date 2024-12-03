import React from 'react';
import '../stylesheets/MainPage.css';
import GamesListPage from "./GamesListPage";
import {BrowserRouter as Router, Routes, Route, NavLink, HashRouter} from 'react-router-dom';
import GamePage from "./GamePage"; // Assuming a CSS file for styling

const MainPage = () => {
    return (
        <div className="container">
            {/* Navbar */}
            <HashRouter>
            <nav className="navbar">
                <h1 className="navbar-title">Synergies</h1>
                <ul className="navbar-menu">
                    <NavLink className="navbar-element" to="/">Home</NavLink>
                    <NavLink className="navbar-element" to="/about">About</NavLink>
                </ul>
            </nav>
            <div className="content">
                <Routes>
                    <Route path="/" element={<GamesListPage/>}/>
                    <Route path={"/game/:gameID"} element={<GamePage/>}/>
                </Routes>
            </div>
            </HashRouter>
        </div>
    );
};

export default MainPage;