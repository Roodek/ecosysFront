// GamesPage.jsx
import React, {useEffect, useState, useRef} from 'react';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import GameListEntry from "./GameListEntry";
import {useNavigate} from 'react-router-dom';
import '../stylesheets/GamesListPage.css'
import {Button, Spinner} from "react-bootstrap";

const GamesListPage = ({setCurrentGameTabVisible=()=>{}}) => {
    const [games, setGames] = useState([]);
    const [messages, setMessages] = useState([]);
    const [topicID, setTopicID] = useState([]);
    const [playerName, setPlayerName] = useState([]);
    const client = useRef(null); // Define client as a ref
    const navigate = useNavigate()
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
            gamesWebsocketSubscription = client.current.subscribe('/topic/games', (message) => {
                const messageBody = JSON.parse(message.body);
                fetchGames()
                console.log("message got: "+ messageBody)
                setMessages((prevMessages) => [...prevMessages, messageBody]);
            });
        };
        console.log("list page opened")
        client.current.activate();
        fetchGames()
        return () => {
            if(gamesWebsocketSubscription){
                gamesWebsocketSubscription.unsubscribe()
                gamesWebsocketSubscription=null
            }
            if (client.current && client.current.connected) {
                client.current.deactivate();
            }
        };
    }, []);

    const sendMessage = () => {
        const message = {from: 'React Client', content: 'Hello from React!'};
        if (client.current) {
            client.current.publish({
                destination: '/app/games',
                body: JSON.stringify(message),
            });
        }
        fetchGames()
    };

    const sendTargetedMessage = () => {
        const message = {from: 'React Client', content: 'Hello from React!'};
        if (client.current) {
            client.current.publish({
                destination: '/app/games/' + topicID,
                body: JSON.stringify(message),
            });
        }
    }
    const connectToTargetTopic = () => {
        client.current.subscribe('/topic/games/' + topicID, (message) => {
            const messageBody = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, messageBody]);
        });
    }
    const fetchGames = () => {
        console.log("fetchgames")
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
        fetch(process.env.REACT_APP_API_URL + '/games/new', {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                // Add other headers if needed, like Authorization
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json(); // Parse the response as JSON
            })
            .then(gameID => {
                console.log('Successfully created game:', gameID); // Handle the parsed data
                joinGame(gameID)
            })
            .catch(error => {
                console.error('Error:', error); // Handle any errors
            });
    }
    const joinGame = (gameID,players=[]) => {
        if(gamesWebsocketSubscription){
            gamesWebsocketSubscription.unsubscribe()
            gamesWebsocketSubscription=null
        }
        if(localStorage.getItem('playerID') && players && players.map(player=>player._id).includes(localStorage.getItem('playerID'))) {
            goToGamePage(gameID)
            localStorage.setItem('gameID', gameID)
            setCurrentGameTabVisible(true)
        }else {
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
                    return response.json(); // Parse the response as JSON
                })
                .then(data => {
                    console.log('Success:', data); // Handle the parsed data
                    localStorage.setItem('playerID', data)
                    localStorage.setItem('playerName', playerName.toString())
                    localStorage.setItem('gameID', gameID)
                    setCurrentGameTabVisible(true)
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
            <h1>Games</h1>
            <h3>Enter you name:</h3><input disabled={!!localStorage.getItem("playerName")} type={"text"} onChange={(e) => setPlayerName(e.target.value)}/>
            {loading && <Spinner animation="border" variant="success" />}
            <div style={playerName.length > 0 ? styles.list : styles.listDisabled}>
                {games.map((game, index) => (
                    game.turn===0 && <div key={index}
                        style={playerName.length > 0 && game.players.length < 6 ? styles.list : styles.listDisabled}>
                        <GameListEntry numberOfPayers={String(game.players.length)}
                                       gameID={game.id}
                                       playerNames={game.players.map(player => player.name).join(", ")}
                                       onClick={() => joinGame(game.id,game.players,)}/></div>
                ))}
            </div>
            <Button variant="success" disabled={playerName.length === 0} onClick={createNewGame}>create new game</Button>
            {/*<button onClick={connectToTargetTopic}>connect to target topic</button>*/}
            {/*<button onClick={sendMessage}>Send Message</button>*/}
            {/*<input type={"text"} onChange={(e) => setTopicID(e.target.value)}/>*/}
            {/*<button onClick={sendTargetedMessage}>Send target</button>*/}
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.from}: {msg.content}</li>
                ))}
            </ul>

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
