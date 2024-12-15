import React, {useEffect, useState} from 'react';
import '../stylesheets/MainPage.css';
import GamesListPage from "./GamesListPage";
import {BrowserRouter as Router, Routes, Route, NavLink, HashRouter} from 'react-router-dom';
import GamePage from "./GamePage";
import {
    Container,
    Button,
    Nav,
    Navbar,
    NavDropdown,
    Offcanvas,
    Accordion,
    Image,
    OverlayTrigger, Tooltip
} from "react-bootstrap"; // Assuming a CSS file for styling
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
            <OverlayTrigger
                placement="left"
                delay={{ show: 300, hide: 400 }}
                overlay={<Tooltip  className={"big-card"} id="button-tooltip">
                    <Image className={"rules-cards-big"} src={require("../../public/themes/"+getTheme()+"/"+card+".webp")} fluid/>
                </Tooltip>}
            >
                <Image className={"rules-cards"} src={require("../../public/themes/"+getTheme()+"/"+card+".webp")} fluid/>
            </OverlayTrigger>
    }

    const getTheme = ()=>{
        return localStorage.getItem("theme")? localStorage.getItem("theme"):"REGULAR";
    }
    return (
        <div className="page-container">
            <HashRouter>
                <Navbar expand="lg" className="nav-custom">
                    <Container>
                        <Navbar.Brand as={NavLink} to="/">Synergies</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                                <Nav.Link as={Button} onClick={toggleRulesCanvas} >Rules</Nav.Link>
                                <NavDropdown title="Theme" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={()=>{selectTheme("PIXEL")}}>Pixel</NavDropdown.Item>
                                    <NavDropdown.Item onClick={()=>{selectTheme("DARK_FANTASY")}}>Dark fantasy</NavDropdown.Item>
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
            <Offcanvas className={"rules-container"} show={isCanvasVisible} placement={'end'} onHide={handleCloseCanvas} scroll={true} backdrop={true}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Rules</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Accordion>
                        <Accordion.Item className={"accordion-item-custom"}  eventKey="0">
                            <Accordion.Header>About</Accordion.Header>
                            <Accordion.Body>
                                Welcome to my implementation of Ecosystem.
                                The goal is to build a 4x5 or 5x4 board consisting of animal or land cards.
                                You can hover over the cards images for a while to see them in bigger size.
                                <br/>
                                All of the images visible were generated using AI*
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="1">
                            <Accordion.Header>How to play</Accordion.Header>
                            <Accordion.Body>
                                Each player is dealt 11 cards.
                                During a turn each player selects a card from hand and clicks on one of the available slots.
                                After each Player submitted their move the cards from hand get swapped between players.
                                With the end of 10th turn each player is dealt another 10 cards (to get 11 in hand) and the direction of swap changes.
                                When players reach the board size of 20 cards each player gets respective points to the card property.
                                The cards are adjacent if they are placed side by side, not diagonally.
                                Each category of cards that do not grant any points is an ecosystem gap.
                                Depending on the count of gaps each player gets:
                                <ul>
                                    <li>12 points if they have 0-2 gaps</li>
                                    <li>7 points if they have 3 gaps</li>
                                    <li>3 points if they have 4 gaps</li>
                                    <li>0 points if they have 5 gaps</li>
                                    <li>-5 points if they have more than 5 gaps</li>
                                </ul>
                                In the case of a tie, the player with less gaps wins.
                                <br/>
                                How each card works can be checked by clicking each card below.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="2">
                            <Accordion.Header>{renderCard('WOLF')}</Accordion.Header>
                            <Accordion.Body>
                                The points are assigned for who has the most wolves present on the board
                                <ul>
                                    <li>I - 12</li>
                                    <li>II - 8</li>
                                    <li>III - 4</li>
                                </ul>
                                If multiple players gets the same amount of wolves they get the same amount of points.
                                However, if for example there are 4 players where 2 get the same amount of wolves in the first place, the 2 players get 12 points,
                                the 3rd player will get only 4 points as 2 places are already taken.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="3">
                            <Accordion.Header>{renderCard('FOX')}</Accordion.Header>
                            <Accordion.Body>
                                Each fox grants 3 points if it is not adjacent to
                                any <strong>wolf</strong> or <strong>bear</strong>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="4">
                            <Accordion.Header>{renderCard('BEE')}</Accordion.Header>
                            <Accordion.Body>
                                Bee gets 3 points per each adjacent <strong>meadow</strong> card
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="5">
                            <Accordion.Header>{renderCard('BEAR')}</Accordion.Header>
                            <Accordion.Body>
                                Bear gets 2 points per each adjacent <strong>bee</strong> or <strong>fish</strong> card
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="6">
                            <Accordion.Header>{renderCard('EAGLE')}</Accordion.Header>
                            <Accordion.Body>
                                Eagle gets 2 points per each <strong>rabbit</strong> or <strong>fish</strong> card that is within 2 cards range (diagonally 1)
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="7">
                            <Accordion.Header>{renderCard('FISH')}</Accordion.Header>
                            <Accordion.Body>
                                Fish gets 2 points per each adjacent <strong>dragonfly</strong> or <strong>river</strong> card
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="8">
                            <Accordion.Header>{renderCard('DRAGONFLY')}</Accordion.Header>
                            <Accordion.Body>
                                Dragonfly grants 1 point per each <strong>river</strong> card that builds the river adjacent to the dragonfly
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="9">
                            <Accordion.Header>{renderCard('ELK')}</Accordion.Header>
                            <Accordion.Body>
                                Gives 2 points per each row and column that has at least 1 elk
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="10">
                            <Accordion.Header>{renderCard('RABBIT')}</Accordion.Header>
                            <Accordion.Body>
                                Grants 1 point.
                                When rabbit is placed it enables swapping 2 cards already present on board (the just placed rabbit included).
                                The swap happens if after placing rabbit card a player clicks the <strong>select cards to swap button</strong> and then selects 2 cards to swap and submits move
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="11">
                            <Accordion.Header>{renderCard('MEADOW')}</Accordion.Header>
                            <Accordion.Body>
                                Each meadow is created by placing <strong>meadow</strong> card adjacent to another <strong>meadow</strong> card.
                                Depending on a size of meadow created this way, <strong>each</strong> meadow <strong>(not
                                meadow card)</strong> gets points:
                                    <ul>
                                        <li>1 - 0 points</li>
                                        <li>2 - 3 points</li>
                                        <li>3 - 6 points</li>
                                        <li>4 - 10 points</li>
                                        <li>5 - 15 points</li>
                                    </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item className={"accordion-item-custom"} eventKey="12">
                            <Accordion.Header>{renderCard('RIVER')}</Accordion.Header>
                            <Accordion.Body>
                                The points are given based on river length (river cards adjacent to each other) the player with longest rivers get:
                                <ul>
                                    <li>I - 8 points</li>
                                    <li>II - 5 points</li>
                                </ul>
                                Potential ties are resolved the same way as <strong>wolves</strong>
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