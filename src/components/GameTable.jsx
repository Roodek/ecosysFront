import React, {useState} from "react";
import "../stylesheets/GameTable.css";
import PropTypes from "prop-types";
import CardInHand from "./CardInHand";
import CardOnBoard from "./CardOnBoard"; // For styling

const GameTable = ({
                       smallBoards,
                       largeBoard,
                       hand,
                       onSubmitMove,
                       availableMoves
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
        console.log("cdc")
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

    const removeFirstOccurrence = (array, element) =>
        (array.indexOf(element) !== -1 ? array.splice(array.indexOf(element), 1) : array);

    return (
        <div className="game-table">
            {/* Top Section: Two Small Boards */}
            <div className="boards-container">
                {smallBoards.map((board, index) => (
                    <div key={index} className="small-board">
                        {board.map((row, rowIndex) => (
                            <div key={rowIndex} className="row">
                                {row.map((cell, cellIndex) => (
                                    cell && <div key={cellIndex} className="cell">
                                        {cell}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="large-board">
                {largeBoard.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, cellIndex) =>
                                <CardOnBoard key={'' + rowIndex + cellIndex}
                                             card={selectedSlot && (rowIndex === selectedSlot.coordX && cellIndex === selectedSlot.coordY) ? selectedCard : cell}
                                             onClick={() => getSlotSelectionAction(rowIndex, cellIndex)}
                                             state={getSlotState(rowIndex, cellIndex)}/>
                        )}
                    </div>
                ))}
            </div>
            {swapButtonVisible && <button onClick={swapCards}>select cards to swap</button>}
            {swapButtonVisible && <h3>you can select slots to swap</h3>}
            <div className="hand-container">
                {hand && removeFirstOccurrence(hand,selectedCard).map((card, index) => (
                    <CardInHand key={index} card={card} onClick={() => {
                        selectCard(card, index)
                    }} selected={selectedCardIndex === index}/>
                ))}
            </div>
            <button disabled={isSubmitMoveDisabled()}
                    onClick={() => onSubmitMove(selectedCard, selectedSlot, swappedSlots)}>submit
                move
            </button>
            <button onClick={cancelMove}>cancel</button>
        </div>
    );
};

GameTable.propTypes = {
    smallBoards: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    ).isRequired, // A 3D array of strings
    largeBoard: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.string)
    ).isRequired, // A 2D array of strings
    hand: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmitMove: PropTypes.func.isRequired// put card post call
};

export default GameTable;
