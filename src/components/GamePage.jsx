import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import GameListEntry from "./GameListEntry";
import {useLocation, useNavigate} from "react-router-dom";

const GamePage = () => {
    const location = useLocation();
    const {gameID, playerName} = location.state || {};
    const [game,setGame] = useState([]);

    useEffect(()=>{
        window.addEventListener("beforeunload",handleBeforeUnload)
        window.addEventListener("popstate",handleBeforeUnload)

        fetchGame()

        return () => {
            // handleBeforeUnload()
            console.log("clean")
            window.removeEventListener("popstate",handleBeforeUnload)
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    },[])


    const fetchGame = () =>{
        fetch(process.env.REACT_APP_API_URL + '/games/'+gameID)
            .then(response => response.json())
            .then(game => {console.log(game);setGame(game)})
            .catch(error => console.log(error));
    }

    const handleBeforeUnload = () => {
        console.log("unload")
        fetch(process.env.REACT_APP_API_URL + '/games/' + gameID + '/leave', {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                // Add other headers if needed, like Authorization
            },
            body: JSON.stringify({
                playerID: localStorage.getItem('playerID')
            }) // Convert the request body to a JSON string
        }).then()
    }
    const startGame = () =>{
        console.log(game)
    }
    return (
        <div className="GameWaitingRoom">
            <div style={styles.gameWindow}>
                <h1>GamePage: {gameID}</h1>
                <h3>{localStorage.getItem('playerID')}</h3>
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