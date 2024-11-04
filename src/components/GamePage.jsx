import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import GameListEntry from "./GameListEntry";
import {useLocation} from "react-router-dom";

const GamePage = () => {
    const location = useLocation();
    const {gameID, playerName} = location.state || {};
    const [game,setGame] = useState([]);

    useEffect(()=>{
        fetchGame()
    },[])
    const fetchGame = () =>{
        fetch(process.env.REACT_APP_API_URL + '/games/'+gameID)
            .then(response => response.json())
            .then(game => {console.log(game);setGame(game)})
            .catch(error => console.log(error));
    }
    const startGame = () =>{
        console.log(game)
    }
    return (
        <div className="GameWaitingRoom">
            <div style={styles.gameWindow}>
                <h1>GamePage: {gameID}</h1>
                {game.players && game.players[0].name===playerName && <button onClick={startGame}>start game</button>}
            </div>

        </div>);
};

const styles={
    gameWindow:{
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