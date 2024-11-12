import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import GameListEntry from "./GameListEntry";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const GamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {playerName} = location.state || {};
    const {gameID} = useParams()
    const [game, setGame] = useState([]);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeLeave)
        window.addEventListener("popstate", handleBeforeLeave)
        console.log("onload: "+joining)

        fetchGame()

        return () => {
            window.removeEventListener("popstate", handleBeforeLeave)
            window.removeEventListener("beforeunload", handleBeforeLeave);
        }
    }, [])

    const fetchGame = () => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + gameID)
            .then(response => response.json())
            .then(game => {
                console.log(game);
                setGame(game)
            })
            .catch(error => console.log(error));
    }

    const handleBeforeLeave = () => {
        if (localStorage.getItem('playerID')!=null) {
            console.log("unload")
            const data = {
                playerID: localStorage.getItem('playerID')
            }
            navigator.sendBeacon(process.env.REACT_APP_API_URL + '/games/' + gameID + '/leave',
                JSON.stringify(data))
            localStorage.removeItem('playerID')
        }
        navigate('/');
    }

    const startGame = () => {
        console.log(game)
    }
    return (
        <div className="GameWaitingRoom">
            <div style={styles.gameWindow}>
                <h1>GamePage: {gameID}</h1>
                <h3>{localStorage.getItem('playerID')}</h3>
                {game.players && game.players[0].name === playerName && <button onClick={startGame}>start game</button>}
                <button onClick={handleBeforeLeave}>leave</button>
            </div>

        </div>);
};

const styles = {
    gameWindow: {
        padding: '10px',
        border: '5px solid #ddd',
        borderRadius: '4px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        backgroundColor: '#34db5e',
    }
}
export default GamePage;