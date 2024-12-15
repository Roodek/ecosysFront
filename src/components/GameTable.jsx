import React, {useState} from "react";
import "../stylesheets/GameTable.css";
import PropTypes from "prop-types";
import CardInHand from "./CardInHand";
import CardOnBoard from "./CardOnBoard";
import {Button} from "react-bootstrap"; // For styling

const GameTable = ({
                       turn,
    playerName,
                       playerNames,
                       opponents,
                       largeBoard,
                       hand,
                       onSubmitMove,
                       availableMoves,
                       moveSelected
                   }) => {
    const [cardPut, setCardPut] = useState(false)
    const [selectedCardIndex, setSelectedCardIndex] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [availableSlots, setAvailableSlots] = useState([])
    const [rabbitPut, setRabbitPut] = useState(false)
    const [swappedSlots, setSwappedSlots] = useState([])
    const [swapButtonVisible, setSwapButtonVisible] = useState(false)

    const selectCard = (card, index) => {
        setSelectedCardIndex(index)
        setSelectedCard(card)
        setAvailableSlots(availableMoves.availableSlots)
        setSelectedSlot(null)
        setCardPut(false)
        setRabbitPut(false)
        setSwapButtonVisible(false)
    }
    const selectSlot = (x, y) => {
        setSelectedSlot({coordX: x, coordY: y});
        setCardPut(true)
        if (selectedCard === "RABBIT") {
            setSwapButtonVisible(true)
        }
    }
    const selectSlotForSwap = (x, y) => {
        const slot = {coordX: x, coordY: y}
        if (swappedSlots.some(slot => slot.coordX === x && slot.coordY === y)) {
            console.log(swappedSlots)
            console.log(slot)
            setSwappedSlots(swappedSlots.filter(slot => slot.coordX !== x || slot.coordY !== y));
        } else {
            if (swappedSlots.length === 2) {
                setSwappedSlots(swappedSlots.pop())
            }
            setSwappedSlots([...swappedSlots, slot])
        }
    }

    const swapCards = () => {
        setRabbitPut(true)
        var slots = [selectedSlot]
        for (var i = 0; i < largeBoard.length; i++) {
            for (var j = 0; j < largeBoard[i].length; j++) {
                if (largeBoard[i][j] !== null) {
                    slots.push({coordX: i, coordY: j});
                }
            }
        }
        setAvailableSlots(slots)
    }
    const cancelMove = () => {
        setSelectedSlot(null)
        setSelectedCard(null)
        setCardPut(false)
        setSelectedCardIndex(null)
        setSwappedSlots([])
        setAvailableSlots([])
        setSwapButtonVisible(false)
    }

    const getSlotState = (x, y) => {
        if (swappedSlotsContains(x, y) || (selectedSlot && selectedSlot.coordX === x && selectedSlot.coordY === y)) {
            return "SELECTED"
        }
        return availableSlots.some(obj => obj && (obj.coordX === x && obj.coordY === y)) ?
            "AVAILABLE" :
            "NONE"
    }
    const isSubmitMoveDisabled = () => {
        if (swappedSlots.length === 1)
            return true
        return !cardPut
    }

    const swappedSlotsContains = (x, y) => {
        return swappedSlots.some(it => it.coordX === x && it.coordY === y)
    }
    const getSlotSelectionAction = (rowIndex, cellIndex) => {
        if (isSlotAvailable(rowIndex, cellIndex)) {
            if (rabbitPut) {
                selectSlotForSwap(rowIndex, cellIndex)
            } else {
                selectSlot(rowIndex, cellIndex)
            }
        }
    }

    const isSlotAvailable = (x, y) => {
        return availableSlots.some(obj => obj && (obj.coordX === x && obj.coordY === y))
    }

    return (
        <div className="game-table">
            {/* Top Section: Two Small Boards */}
            <div className="boards-container">
                {opponents.map((opponent, index) => (
                    <div className={"opponent-board"} key={index}>
                        <h3>{opponent.name}</h3>{opponent.selectedMove && <p>MOVE SUBMITTED</p>}
                        <div className="small-board">
                            {opponent.board.map((row, rowIndex) => (
                                <div key={rowIndex} className="table-row">
                                    {row.map((cell, cellIndex) => (
                                        <div key={cellIndex} className="cell">
                                            <CardOnBoard key={'' + rowIndex + cellIndex}
                                                         card={cell}
                                                         onClick={() => {
                                                         }}
                                                         state={"NONE"}/>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="large-board">
                {largeBoard.map((row, rowIndex) => (
                    <div key={rowIndex} className="table-row">
                        {row.map((cell, cellIndex) =>
                            moveSelected && moveSelected.selectedSlot.coordX === rowIndex && moveSelected.selectedSlot.coordY === cellIndex ?
                                <CardOnBoard key={'' + rowIndex + cellIndex}
                                             card={moveSelected.selectedCard}
                                             onClick={() => {
                                             }}
                                             state={'CARD_PUT'}/>
                                : <CardOnBoard key={'' + rowIndex + cellIndex}
                                               card={selectedSlot && (rowIndex === selectedSlot.coordX && cellIndex === selectedSlot.coordY) ? selectedCard : cell}
                                               onClick={() => getSlotSelectionAction(rowIndex, cellIndex)}
                                               state={getSlotState(rowIndex, cellIndex)}/>
                        )}
                    </div>
                ))}
            </div>
            <div className="game-panel">
                <div className={"action-panel"}>
                    {swapButtonVisible && <Button variant={"outline-info"} onClick={swapCards}>select cards to swap</Button>}
                    {swapButtonVisible && <h3>you can select slots to swap</h3>}
                    <div className={"player-info"}>
                        Direction of hand swap: {turn<11?'<= '+playerNames.map(name=>name.substring(name.length-2)).join(' <= ')+ ' <=':'=> '+playerNames.map(name=>name.substring(name.length-2)).join(' => ') + ' =>'}
                        <br/>
                        Your player tag: {playerName}
                    </div>
                    <div className={"control-panel"}>
                    <div className="hand-container">
                        {hand && hand.map((card, index) => (
                            <CardInHand key={index} card={card} onClick={() => {
                                selectCard(card, index)
                            }} selected={selectedCardIndex === index}/>
                        ))}
                    </div>
                    <Button disabled={isSubmitMoveDisabled()}
                            variant={"success"}
                            onClick={() => {
                                onSubmitMove(selectedCard, selectedSlot, swappedSlots)
                                cancelMove()
                            }}>Submit
                        move
                    </Button>
                    <Button variant={"danger"} onClick={cancelMove}>Cancel move</Button>
                    </div>
                </div>
                {(moveSelected || largeBoard.flat().filter(elem => elem != null).length === 20) &&
                    <div className={"game-disabled-overlay"}/>}
            </div>
        </div>
    );
};

GameTable.propTypes = {
    turn: PropTypes.number.isRequired,
    playerName: PropTypes.string.isRequired,
    playerNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    opponents: PropTypes.array.isRequired, // A 3D array of strings
    largeBoard: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.string)
    ).isRequired, // A 2D array of strings
    hand: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmitMove: PropTypes.func.isRequired,// put card post call
    moveSelected: PropTypes.object,
};

export default GameTable;
