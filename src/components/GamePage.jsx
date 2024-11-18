import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import GameTable from "./GameTable";

const GamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const playerName = localStorage.getItem("playerName");
    const {gameID} = useParams()
    const [game, setGame] = useState([]);
    const [hand, setHand] = useState(null);
    const [playerBoard, setPlayerBoard] = useState({});
    const [opponentBoards, setOpponentBoards] = useState({});
    const [joining, setJoining] = useState(false);
    const client = useRef(null); // Define client as a ref
    const [availableMoves, setAvailableMoves] = useState([]);

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeLeave)
        window.addEventListener("popstate", handleBeforeLeave)
        fetchGameForPlayer()
        fetchAvailableMovesForPlayer()

        client.current = new Client({
            brokerURL: process.env.REACT_APP_WS_URL,
            connectHeaders: {},
            // debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => new SockJS(process.env.REACT_APP_SERVER_URL + '/ws'),
        });

        client.current.onConnect = () => {
            // client.current.subscribe('/topic/games', (message) => {
            //     const messageBody = JSON.parse(message.body);
            //     fetchGame()
            //     console.log("message got:"+messageBody)
            //     //setMessages((prevMessages) => [...prevMessages, messageBody]);
            // });
            connectToGameSocket()
        };
        client.current.activate();
        console.log("list page opened")
        return () => {
            window.removeEventListener("popstate", handleBeforeLeave)
            window.removeEventListener("beforeunload", handleBeforeLeave);
            if (client.current && client.current.connected) {
                client.current.deactivate();
            }
        }
    }, [])

    const fetchGameForPlayer = () => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + gameID + '/' + localStorage.getItem('playerID'))
            .then(response => response.json())
            .then(game => {
                console.log(game);
                setGame(game)
                const player = game.players.find(player => player._id === localStorage.getItem('playerID'))
                setPlayerBoard(processBoard(player.board))
                setOpponentBoards(game.players.filter(player => player._id !== localStorage.getItem('playerID'))
                    .map(opponent => processBoard(opponent.board)))
            })
            .catch(error => console.log(error));
    }
    const fetchAvailableMovesForPlayer = () => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + gameID + '/players/' + localStorage.getItem('playerID') + '/availableMoves')
            .then(response => response.json())
            .then(possibleMoves => {
                setHand(possibleMoves.cardsInHand.map(card => card.cardType))
                setAvailableMoves(possibleMoves)
            })
            .catch(error => console.log(error));

    }

    const processBoard = (board) => {
        return board.map(row => row.map(card => (card === null) ? null : card.cardType))
    }
    const handleBeforeLeave = () => {
        if (localStorage.getItem('playerID') != null) {
            console.log("unload")
            const data = {
                playerID: localStorage.getItem('playerID')
            }
            // navigator.sendBeacon(process.env.REACT_APP_API_URL + '/games/' + gameID + '/leave',
            //     JSON.stringify(data))
            //localStorage.removeItem('playerID')
        }
        navigate('/');
    }

    const startGame = () => {
        console.log(game)
    }

    const connectToGameSocket = () => {
        if (client.status === 'CONNECTED') {
            client.current.subscribe('/topic/games/' + gameID, (message) => {
                const messageBody = JSON.parse(message.body);

                reactToMessage(messageBody)
                fetchGameForPlayer()
            });
        }
    }
    const reactToMessage = (messageBody) => {
        console.log(messageBody)//todo process message accordingly
    }
    const playCard = (move) => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + gameID + '/players/' + localStorage.getItem('playerID') + '/putCard',
            {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                    // Add other headers if needed, like Authorization
                },
                body: move
            })
            .then(response => response.json())
            .then(game => {
                console.log(game);
                setGame(game)
            })
            .catch(error => console.log(error));
    }
    const submitMove = (card, selectedSlot) =>{
        console.log("move submitted: "+card+' - '+ JSON.stringify(selectedSlot))
    }
    return (
        <div>
            <div className="GameWaitingRoom">
                {game && game.turn === 0 && <div style={styles.gameWindow}>
                    <h1>Game: {gameID}</h1>
                    <h2>host: {game.players && game.players[0].name}</h2>
                    <h3>players: {game.players && game.players.map(player => player.name).join(", ")}</h3>
                    {game.players && game.players.length > 0 && game.players[0].playerID === localStorage.getItem('playerID') &&
                        <button disabled={game.players.length < 3} onClick={startGame}>start game</button>}
                    <button onClick={handleBeforeLeave}>leave</button>
                </div>}
                {game && game.turn > 0 && <GameTable hand={hand} largeBoard={playerBoard} smallBoards={opponentBoards} onSubmitMove={submitMove} availableMoves={availableMoves}/>}
            </div>
        </div>
    )
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