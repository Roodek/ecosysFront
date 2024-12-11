import React, {useEffect, useState} from 'react';
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
    const [currentGameTabVisible, setCurrentGameTabVisible] = useState(!!localStorage.getItem('gameID'));

    return (
        <div className="container">
            <HashRouter>
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand as={NavLink} to="/">Synergies</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                                <Nav.Link as={NavLink} to="/about">Rules</Nav.Link>
                                <NavDropdown title="Theme" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={()=>{selectTheme("PIXEL")}}>Pixel</NavDropdown.Item>
                                    <NavDropdown.Item onClick={()=>{selectTheme("REGULAR")}}>Regular</NavDropdown.Item>
                                </NavDropdown>
                                {currentGameTabVisible && <Nav.Link as={NavLink} to={'/game/' + localStorage.getItem("gameID")}>CurrentGame</Nav.Link>}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            <div className="content">
                <Routes>
                    <Route path="/" element={<GamesListPage setCurrentGameTabVisible={(state)=>setCurrentGameTabVisible(state)}/>}/>
                    {/*<Route path="/about" element={<RulesPage/>}/>*/}
                    <Route path={"/game/:gameID"} element={<GamePage setCurrentGameTabVisible={(state)=>setCurrentGameTabVisible(state)}/>}/>
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