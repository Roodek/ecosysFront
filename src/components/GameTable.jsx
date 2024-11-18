import React, {useState} from "react";
import "../stylesheets/GameTable.css";
import PropTypes from "prop-types";
import Card from "./Card"; // For styling

const GameTable = ({
                       smallBoards,
                       largeBoard,
                       hand,
                       onSubmitMove,
                       availableMoves
                   }) => {
    const [moveCompleted, setMoveCompleted] = useState(false)
    const [selectedCardIndex, setSelectedCardIndex] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null)
    const [availableSlots,setAvailableSlots] = useState([])

    const selectCard = (card, index) => {
        setSelectedCardIndex(index)
        setSelectedCard(card)
        setAvailableSlots(availableMoves.availableSlots)
        console.log(card)
        console.log(availableMoves.availableSlots)
    }

    const isSlotAvailable = (x,y)=>{
        return availableSlots.some(obj=> obj.coordX===x && obj.coordY === y)
    }

    return (
        <div className="game-table">
            {/* Top Section: Two Small Boards */}
            <div className="boards-container">
                {smallBoards.map((board, index) => (
                    <div key={index} className="small-board">
                        {board.map((row, rowIndex) => (
                            <div key={rowIndex} className="row">
                                {row.map((cell, cellIndex) => (
                                    <div key={cellIndex} className="cell">
                                        {cell}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Bottom Section: Large Board */}
            <div className="large-board">
                {largeBoard.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, cellIndex) => (
                            <div key={cellIndex} className="cell">
                                {cell}---{isSlotAvailable(rowIndex,cellIndex)?"true":"false"}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Rectangular Panels */}
            <div className="hand-container">
                {hand.map((card, index) => (
                    <Card key={index} card={card} onClick={() => {
                        selectCard(card, index)
                    }} selected={selectedCardIndex === index}/>
                ))}
            </div>
            <button disabled={!moveCompleted} onClick={onSubmitMove}>submit move</button>
            <button>cancel</button>
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
