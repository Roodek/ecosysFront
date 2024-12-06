import React, {useState} from 'react';
import '../stylesheets/MainPage.css';
import GamesListPage from "./GamesListPage";
import {BrowserRouter as Router, Routes, Route, NavLink, HashRouter} from 'react-router-dom';
import GamePage from "./GamePage";
import {Container, DropdownButton, Nav, Navbar, NavDropdown} from "react-bootstrap"; // Assuming a CSS file for styling
import Dropdown from 'react-bootstrap/Dropdown';
import RulesPage from "./RulesPage";
import PropTypes from "prop-types";
import GameListEntry from "./GameListEntry";


const MainPage = ({selectTheme}) => {
    return (
        <div className="container">
            <HashRouter>
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="#home">Synergies</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                                <Nav.Link as={NavLink} to="/about">Rules</Nav.Link>
                                <NavDropdown title="Theme" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={()=>{selectTheme("PIXEL")}}>Pixel</NavDropdown.Item>
                                    <NavDropdown.Item onClick={()=>{selectTheme("REGULAR")}}>Regular</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            <div className="content">
                <Routes>
                    <Route path="/" element={<GamesListPage/>}/>
                    <Route path="/about" element={<RulesPage/>}/>
                    <Route path={"/game/:gameID"} element={<GamePage/>}/>
                </Routes>
            </div>
            </HashRouter>
        </div>
    );
};

MainPage.propTypes = {
    selectTheme: PropTypes.func
};
export default MainPage;