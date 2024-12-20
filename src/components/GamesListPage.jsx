// GamesPage.jsx
import React, {useEffect, useState, useRef} from 'react';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import GameListEntry from "./GameListEntry";
import {useNavigate} from 'react-router-dom';
import '../stylesheets/GamesListPage.css'
import {Badge, Button, Spinner} from "react-bootstrap";

const GamesListPage = ({
                           setCurrentGameTabVisible = () => {
                           }
                       }) => {
    const [games, setGames] = useState([]);
    const [playerName, setPlayerName] = useState(() => {
        return localStorage.getItem('playerName') || '';
    });
    const client = useRef(null); // Define client as a ref
    const navigate = useNavigate()
    const [createNewGameEnabled, setCreateNewGameEnabled] = useState(true);
    const [loading, setLoading] = useState(false);

    let gamesWebsocketSubscription = null
    useEffect(() => {
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
            gamesWebsocketSubscription = client.current.subscribe('/topic/games', () => {
                fetchGames()
            });
        };
        client.current.activate();
        fetchGames()
        return () => {
            if (gamesWebsocketSubscription) {
                gamesWebsocketSubscription.unsubscribe()
                gamesWebsocketSubscription = null
            }
            if (client.current && client.current.connected) {
                client.current.deactivate();
            }
        };
    }, []);

    const fetchGames = () => {
        setLoading(true);
        fetch(process.env.REACT_APP_API_URL + '/games')
            .then(response => response.json())
            .then(games => {
                setGames(games);
                console.log(games)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                console.log(error)
            });
    }

    const createNewGame = () => {
        setLoading(true)
        setCreateNewGameEnabled(false)
        fetch(process.env.REACT_APP_API_URL + '/games/new', {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                // Add other headers if needed, like Authorization
            }
        })
            .then(response => {
                if (!response.ok) {
                    setCreateNewGameEnabled(true)
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                setLoading(false)
                return response.json(); // Parse the response as JSON
            })
            .then(gameID => {
                console.log('Successfully created game:', gameID); // Handle the parsed data
                joinGame(gameID)
            })
            .catch(error => {
                setCreateNewGameEnabled(true)
                setLoading(false)
                console.error('Error:', error); // Handle any errors
            });
    }
    const joinGame = (gameID, players = []) => {
        setLoading(true)
        if (gamesWebsocketSubscription) {
            gamesWebsocketSubscription.unsubscribe()
            gamesWebsocketSubscription = null
        }
        if (localStorage.getItem('playerID') && players && players.map(player => player._id).includes(localStorage.getItem('playerID'))) {
            setLoading(false)
            goToGamePage(gameID)
            localStorage.setItem('gameID', gameID)
            setCurrentGameTabVisible(true)
        } else {
            fetch(process.env.REACT_APP_API_URL + '/games/' + gameID + '/join', {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                    // Add other headers if needed, like Authorization
                },
                body: JSON.stringify({
                    playerName: playerName
                }) // Convert the request body to a JSON string
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    setLoading(false)
                    return response.json(); // Parse the response as JSON
                })
                .then(data => {
                    console.log('Success:', data); // Handle the parsed data
                    localStorage.setItem('playerID', data)
                    localStorage.setItem('playerName', playerName.toString())
                    localStorage.setItem('gameID', gameID)
                    setCurrentGameTabVisible(true)
                    setLoading(false)
                    goToGamePage(gameID)
                })
                .catch(error => {
                    console.error('Error:', error); // Handle any errors
                });
        }
    }
    const goToGamePage = (gameID) => {
        navigate('/game/' + gameID, {
            state: {
                playerName: playerName
            }
        });
    };

    return (
        <div className={"game-list"}>
            <h1>Available games list</h1>
            <h3>Enter you name:</h3><input value={playerName} type={"text"}
                                           onChange={(e) => setPlayerName(e.target.value)}/>
            {loading && <div><Spinner animation="border" variant="success"/>Loading...</div>}
            <div style={playerName.length > 0 ? styles.list : styles.listDisabled}>
                {games.map((game, index) => (
                    game.turn === 0 && <div key={index}
                                            style={(playerName.length > 0 && game.players.length < 6) && localStorage.getItem('gameID')==null ? styles.list : styles.listDisabled}>

                        <GameListEntry numberOfPayers={String(game.players.length)}
                                       gameID={game.id}
                                       playerNames={game.players.map(player => player.name).join(", ")}
                                       onClick={() => joinGame(game.id, game.players,)}/></div>
                ))}
            </div>
            {
                localStorage.getItem('gameID') ? <Badge bg="secondary">Game already started</Badge>
                    : <Button variant="success" disabled={playerName.length === 0} onClick={createNewGame}>
                        create new game
                    </Button>
            }


        </div>
    );
};

// Basic inline styles for the component
const styles = {
    list: {},
    listDisabled: {
        pointerEvents: 'none',
        opacity: '0.5',
        cursor: 'default'
    }
};

export default GamesListPage;
