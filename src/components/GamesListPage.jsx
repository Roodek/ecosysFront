// GamesPage.jsx
import React, {useEffect, useState, useRef} from 'react';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import GameListEntry from "./GameListEntry";
import {useNavigate} from 'react-router-dom';

const GamesListPage = () => {
    const [games, setGames] = useState([]);
    const [messages, setMessages] = useState([]);
    const [topicID, setTopicID] = useState([]);
    const [playerName, setPlayerName] = useState([]);
    const client = useRef(null); // Define client as a ref
    const navigate = useNavigate()

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
            client.current.subscribe('/topic/games', (message) => {
                const messageBody = JSON.parse(message.body);
                fetchGames()
                setMessages((prevMessages) => [...prevMessages, messageBody]);
            });
        };

        client.current.activate();
        fetchGames()
        return () => {
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
        client.current.subscribe('/topic/messages/' + topicID, (message) => {
            const messageBody = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, messageBody]);
        });

    }
    const fetchGames = () => {
        fetch(process.env.REACT_APP_API_URL + '/games')
            .then(response => response.json())
            .then(games => setGames(games))
            .catch(error => console.log(error));
    }

    const createNewGame = () => {
    }
    const joinGame = (gameID) => {
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
                // if (client.current && client.current.connected) {
                //     client.current.publish({
                //         destination: "/app/updatePlayerId",
                //         body: JSON.stringify({data})
                //     });
                // }
                console.log('Success:', data); // Handle the parsed data
                localStorage.setItem('playerID',data)
            })
            .catch(error => {
                console.error('Error:', error); // Handle any errors
            });
        console.log("gameID: " + gameID)
        goToGamePage(gameID)

    }
    const goToGamePage = (gameID) => {
        navigate('/game', {
            state: {
                gameID: gameID,
                playerName: playerName
            }
        });
    };

    return (
        <div>
            <h1>Games</h1>
            <h3>Enter you name:</h3><input type={"text"} onChange={(e) => setPlayerName(e.target.value)}/>
            <ul style={playerName.length > 0 ? styles.list : styles.listDisabled}>
                {games.map((game, index) => (
                    <li key={index}
                        style={playerName.length > 0 && game.players.length < 6 ? styles.list : styles.listDisabled}>
                        <GameListEntry numberOfPayers={String(game.players.length)}
                                       playerNames={game.players.map(player => player.name).join(", ")}
                                       onClick={() => joinGame(game.id)}/></li>
                ))}
            </ul>

            <button onClick={connectToTargetTopic}>connect to target topic</button>
            <button onClick={sendMessage}>Send Message</button>
            <input type={"text"} onChange={(e) => setTopicID(e.target.value)}/>
            <button onClick={sendTargetedMessage}>Send target</button>
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
