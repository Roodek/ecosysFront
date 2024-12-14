import React, {useEffect, useState} from 'react';
import '../stylesheets/MainPage.css';
import GamesListPage from "./GamesListPage";
import {BrowserRouter as Router, Routes, Route, NavLink, HashRouter} from 'react-router-dom';
import GamePage from "./GamePage";
import {Container, Button, Nav, Navbar, NavDropdown, Offcanvas, Accordion, Image} from "react-bootstrap"; // Assuming a CSS file for styling
import Dropdown from 'react-bootstrap/Dropdown';
import RulesPage from "./RulesPage";
import PropTypes from "prop-types";


const MainPage = ({selectTheme}) => {
    const [currentGameTabVisible, setCurrentGameTabVisible] = useState(!!localStorage.getItem('gameID'));
    const [isCanvasVisible, setIsCanvasVisible] = useState(false);

    const toggleRulesCanvas = ()=>{setIsCanvasVisible(!isCanvasVisible)}
    const handleCloseCanvas = () => setIsCanvasVisible(false);

    const renderCard = (card) =>{
        return getTheme() === "REGULAR"?
            card:
            <Image className={"rules-cards"} src={require("../../public/themes/"+getTheme()+"/"+card+".webp")} fluid/>
    }

    const getTheme = ()=>{
        return localStorage.getItem("theme")? localStorage.getItem("theme"):"REGULAR";
    }
    return (
        <div className="page-container">
            <HashRouter>
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand as={NavLink} to="/">Synergies</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                                <Nav.Link as={Button} onClick={toggleRulesCanvas} >Rules</Nav.Link>
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
                    <Route path={"/game/:gameID"} element={<GamePage key={window.location.hash} setCurrentGameTabVisible={(state)=>setCurrentGameTabVisible(state)}/>}/>
                </Routes>
            </div>
            </HashRouter>
            <Offcanvas show={isCanvasVisible} placement={'end'} onHide={handleCloseCanvas} scroll={true} backdrop={true}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Rules</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>About</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>How to play</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>{renderCard('WOLF')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>{renderCard('FOX')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>{renderCard('BEE')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="5">
                            <Accordion.Header>{renderCard('BEAR')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="6">
                            <Accordion.Header>{renderCard('EAGLE')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="7">
                            <Accordion.Header>{renderCard('FISH')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="8">
                            <Accordion.Header>{renderCard('DRAGONFLY')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="9">
                            <Accordion.Header>{renderCard('ELK')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="10">
                            <Accordion.Header>{renderCard('RABBIT')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="11">
                            <Accordion.Header>{renderCard('MEADOW')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="12">
                            <Accordion.Header>{renderCard('RIVER')}</Accordion.Header>
                            <Accordion.Body>
                                TODO
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

MainPage.propTypes = {
    selectTheme: PropTypes.func
};
export default MainPage;