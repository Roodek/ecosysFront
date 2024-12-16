import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import GameTable from "./GameTable";
import "../stylesheets/GamePage.css"
import Ranking from "./Ranking";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {createNewGame, joinGame} from "../apiCalls/commonApiCalls";


const GamePage = ({
                      setCurrentGameTabVisible = (state) => {
                      }
                  }) => {
    const navigate = useNavigate();
    const playerName = localStorage.getItem("playerName");
    const {gameID} = useParams()
    const [game, setGame] = useState([]);
    const [hand, setHand] = useState(null);
    const [playerBoard, setPlayerBoard] = useState({});
    const [opponentBoards, setOpponentBoards] = useState({});
    const [moveSelected, setMoveSelected] = useState({});
    const [availableMoves, setAvailableMoves] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chatVisible, setChatVisible] = useState(false);
    const [rematchGameID, setRematchGameID] = useState('');
    const [currentGameID, setCurrentGameID] = useState(gameID);
    const [newMessage,setNewMessage] = useState(false);
    const client = useRef(null); // Define client as a ref

    let gameSocket = null
    let gameChatSocket = null
    useEffect(() => {
        console.log('gameID: ' + gameID);
        console.log('Current gameID: ' + currentGameID);
        setCurrentGameID(gameID);
        // Cleanup old listeners and resources
        window.removeEventListener("popstate", handleBeforeLeave);
        window.removeEventListener("beforeunload", handleBeforeLeave);
        if (gameSocket) {
            gameSocket.unsubscribe();
        }
        if (gameChatSocket) {
            gameChatSocket.unsubscribe();
        }
        if (client.current && client.current.connected) {
            client.current.deactivate();
        }

        // Add new listeners for the updated gameID
        window.addEventListener("beforeunload", handleBeforeLeave);
        window.addEventListener("popstate", handleBeforeLeave);
        fetchGameForPlayer(); // Fetch the new game details based on the new gameID

        // Reinitialize WebSocket client
        client.current = new Client({
            brokerURL: process.env.REACT_APP_WS_URL,
            connectHeaders: {},
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => new SockJS(process.env.REACT_APP_SERVER_URL + '/ws'),
        });

        client.current.onConnect = () => {
            connectToGameSocket(); // Connect to the game socket with the updated gameID
        };

        client.current.activate();

        return () => {
            // Cleanup on component unmount or before running the effect again
            window.removeEventListener("popstate", handleBeforeLeave);
            window.removeEventListener("beforeunload", handleBeforeLeave);
            if (gameSocket) {
                gameSocket.unsubscribe();
            }
            if (gameChatSocket) {
                gameChatSocket.unsubscribe();
            }
            if (client.current && client.current.connected) {
                client.current.deactivate();
            }
        };
    }, [gameID]); // Add gameID to the dependency array

    const resetGameStateToRematchGame = (newGameID) => {
        setCurrentGameID(newGameID)
        setGame([])
        setMoveSelected({})
        setRematchGameID('')
    }
    const fetchGameForPlayer = () => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + currentGameID + '/players/' + localStorage.getItem('playerID'))
            .then(response => response.json())
            .then(game => {
                processGameResponse(game)
                if (game.turn > 0) {
                    fetchAvailableMovesForPlayer()
                }
            })
            .catch(error => console.log(error));
    }
    const processGameResponse = (gameResponse) => {
        setGame(gameResponse)
        gameResponse.players.map((player, index) => player.name = player.name + ' #' + (index + 1))
        const player = gameResponse.players.find(player => player._id === localStorage.getItem('playerID'))
        setPlayerBoard(processBoard(player.board))
        setMoveSelected(player.selectedMove)
        setOpponentBoards(gameResponse.players.filter(player => player._id !== localStorage.getItem('playerID'))
            .map(opponent => {
                return {
                    name: opponent.name,
                    board: processBoard(opponent.board),
                    selectedMove: opponent.selectedMove
                }
            }))
    }
    const fetchAvailableMovesForPlayer = () => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + currentGameID + '/players/' + localStorage.getItem('playerID') + '/availableMoves')
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
        }
        navigate('/');
    }
    const leaveGame = () => {
        const data = {
            playerID: localStorage.getItem('playerID')
        }
        fetch(process.env.REACT_APP_API_URL + '/games/' + currentGameID + '/leave',
            {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                    // Add other headers if needed, like Authorization
                },
                body: JSON.stringify(data)
            })
            .then(() => {
                localStorage.removeItem('playerID')
                localStorage.removeItem('gameID')
                setCurrentGameTabVisible(false)
                navigate('/')
            })
            .catch(error => console.log(error));
    }

    const leaveFinishedGame = () => {
        localStorage.removeItem('gameID')
        setCurrentGameTabVisible(false)
        navigate('/')
    }

    const isPlayerHost = () => {
        return localStorage.getItem('playerID') != null && localStorage.getItem('playerID') === game.players[0]._id;
    }

    const rematch = () => {
        if (isPlayerHost()) {
            createNewGame().then(newGameID => {
                joinGame(newGameID, playerName).then(newPlayerID => {
                    const payload = {from: 'REMATCH', content: newGameID};
                    if (client.current) {
                        client.current.publish({
                            destination: '/app/games/' + currentGameID,
                            body: JSON.stringify(payload),
                        });
                    }
                    localStorage.setItem('playerID', newPlayerID)
                    localStorage.setItem('playerName', playerName.toString())
                    localStorage.setItem('gameID', newGameID)
                    setCurrentGameTabVisible(true)
                    goToGamePage(newGameID)
                })
                    .catch(error => {
                        console.error('Error:', error); // Handle any errors
                    });
            })
                .catch(error => {
                    console.error('Error:', error); // Handle any errors
                });
        } else {
            joinGame(rematchGameID, playerName).then(data => {
                localStorage.setItem('playerID', data)
                localStorage.setItem('playerName', playerName.toString())
                localStorage.setItem('gameID', rematchGameID)
                setCurrentGameTabVisible(true)
                goToGamePage(rematchGameID)
            })
                .catch(error => {
                    console.error('Error:', error); // Handle any errors
                });
        }
    }
    const goToGamePage = (newGameID) => {
        console.log('go to new gamePage:' + newGameID);
        resetGameStateToRematchGame(newGameID)
        navigate(`/game/${newGameID}`, {
            state: {
                playerName: playerName
            }
        });
    };
    const startGame = () => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + currentGameID + '/start',
            {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                    // Add other headers if needed, like Authorization
                }
            })
            .catch(error => console.log(error));
    }

    const connectToGameSocket = () => {
        gameSocket = client.current.subscribe('/topic/games/' + currentGameID, (message) => {
            const messageBody = JSON.parse(message.body);
            reactToMessage(messageBody)

        });

        gameChatSocket = client.current.subscribe('/topic/games/' + currentGameID + '/chat', (message) => {
            const messageBody = JSON.parse(message.body);
            setNewMessage(!chatVisible)
            setChatMessages((prevMessages) => [...prevMessages, messageBody])
        });

    }

    const reactToMessage = (messageBody) => {
        console.log('got message: ' + JSON.stringify(messageBody))//todo process message accordingly
        if (messageBody.from === 'REMATCH') {
            setRematchGameID(messageBody.content)
            return
        }
        if (messageBody.content !== "left") {
            fetchGameForPlayer()
        }

    }
    const playCard = (move) => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + currentGameID + '/players/' + localStorage.getItem('playerID') + '/putCard',
            {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                    // Add other headers if needed, like Authorization
                },
                body: move
            })
            .then(response => response.json())
            .then(res => {
                console.log(res);
                processGameResponse(res)
            })
            .catch(error => console.log(error));
    }
    const rabbitSwap = (move) => {
        fetch(process.env.REACT_APP_API_URL + '/games/' + currentGameID + '/players/' + localStorage.getItem('playerID') + '/swapMove',
            {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json', // Set the appropriate headers, such as content type
                    // Add other headers if needed, like Authorization
                },
                body: move
            })
            .then(response => response.json())
            .then(res => {
                console.log(res);
                processGameResponse(res)
            })
            .catch(error => console.log(error));
    }
    const submitMove = (card, selectedSlot, swappedCards) => {
        if (swappedCards.length === 0) {
            playCard(
                JSON.stringify({
                    cardType: card,
                    slot: selectedSlot
                }))
        } else {
            rabbitSwap(JSON.stringify({
                rabbitSlot: selectedSlot,
                slotToSwap1: swappedCards[0],
                slotToSwap2: swappedCards[1]
            }))
        }
        console.log(
            "move submitted: " + card + ' - ' + JSON.stringify(selectedSlot) + ' swappedCards: ' + JSON.stringify(swappedCards)
        )
    }
    const processDBBoard = () => {
        return playerBoard && playerBoard[0].length === 0 ? [[null]] : playerBoard
    }
    const handleTextChange = (event) => {
        setMessage(event.target.value)
    }
    const sendMessage = () => {
        const payload = {from: playerName, content: message};
        if (client.current) {
            client.current.publish({
                destination: '/app/games/' + currentGameID + '/chat',
                body: JSON.stringify(payload),
            });
        }
        setMessage('')
    }
    const showHideChat = () => {

        setNewMessage(false)
        setChatVisible(!chatVisible)
    }
    return (
        <div>
            <div className="GameWaitingRoom">
                {game && game.turn === 0 && <div style={styles.gameWindow}>
                    <h1>Game: {gameID}</h1>
                    <h2>host: {game.players && game.players[0] && game.players[0].name}</h2>
                    <h3>players: {game.players && game.players.map(player => player.name).join(", ")}</h3>
                    {game.players && game.players.length > 0 && game.players[0]._id === localStorage.getItem('playerID') &&
                        <Button variant={"success"} disabled={game.players.length < 3} onClick={startGame}>start
                            game</Button>}
                    <Button variant={"warning"} onClick={leaveGame}>leave</Button>
                </div>}
            </div>
            <div className={"game-table"}>
                <div className={"game"}>{game && game.turn > 0 && hand &&
                    <GameTable turn={game.turn}
                               playerName={game.players.find(player => player._id === localStorage.getItem('playerID')).name}
                               playerNames={game.players.map(player => player.name)}
                               hand={hand} largeBoard={processDBBoard()}
                               opponents={opponentBoards}
                               onSubmitMove={submitMove}
                               availableMoves={availableMoves}
                               moveSelected={moveSelected}/>}
                </div>
                {game && game.turn > 20 && <Ranking players={game.players}/>}
                {game && game.turn > 20 &&
                    <div>
                        {(rematchGameID.length > 0 || isPlayerHost()) && <Button onClick={rematch}>Rematch</Button>}
                        <Button onClick={leaveFinishedGame}>End</Button>
                    </div>}
            </div>
            <div className={"chat-window"}>
                <Button onClick={showHideChat} variant={!chatVisible && newMessage?"danger":"warning"}
                        id={"hide-button"}>{chatVisible ? "Hide chat" : "Show chat"}</Button>
                {chatVisible && <div className={"chat-container"}>
                    <Container>
                        {chatMessages.map((chatMessage, messageIndex) => (
                            <Row key={messageIndex}>
                                <Col className={"col-name"}>{chatMessage.from}: </Col>
                                <Col className={"col-message"}> {chatMessage.content}</Col>
                            </Row>))}
                    </Container>
                     <div className={"chat-controls"}>
                        <Form.Control as="textarea"
                                      placeholder={"write message here..."}
                                      onChange={handleTextChange}
                                      value={message}/>
                        <Button disabled={message.length === 0} onClick={sendMessage}>Send</Button>
                    </div>
                </div>}
            </div>
            {/*<ChatComponent chatMessages={chatMessages} onChange={handleTextChange} value={message} onClick={sendMessage}/>*/}
        </div>
    )
};

const styles = {
    gameWindow: {
        padding: '10px',
        border: '5px solid #ddd',
        borderRadius: '4px',
        marginBottom: '10px',
        transition: 'background-color 0.3s',
        backgroundColor: '#34db5e',
    },

}
export default GamePage;