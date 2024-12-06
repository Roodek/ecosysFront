import React from 'react';
import '../stylesheets/MainPage.css';
import GamesListPage from "./GamesListPage";
import {BrowserRouter as Router, Routes, Route, NavLink, HashRouter} from 'react-router-dom';
import GamePage from "./GamePage";
import {Container, DropdownButton, Nav, Navbar, NavDropdown} from "react-bootstrap"; // Assuming a CSS file for styling
import Dropdown from 'react-bootstrap/Dropdown';


const MainPage = () => {
    return (
        <div className="container">
            <HashRouter>
            {/*<Navbar className="navbar">*/}
            {/*    <h1 className="navbar-title">Synergies</h1>*/}
            {/*    <DropdownButton id="dropdown-basic-button" title={"Select theme"}>*/}
            {/*        <Dropdown.Item onClick={()=>{localStorage.setItem("theme","PIXEL")}}>*/}
            {/*            Pixel*/}
            {/*        </Dropdown.Item>*/}
            {/*    </DropdownButton>*/}
            {/*    <ul className="navbar-menu">*/}
            {/*        <NavLink className="navbar-element" to="/">Home</NavLink>*/}
            {/*        <NavLink className="navbar-element" to="/about">About</NavLink>*/}
            {/*    </ul>*/}
            {/*</Navbar>*/}
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="#home">Synergies</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link to="/">Home</Nav.Link>
                                <Nav.Link to="/about">Link</Nav.Link>
                                <NavDropdown title="Theme" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={()=>{localStorage.setItem("theme","PIXEL")}}>Pixel</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
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