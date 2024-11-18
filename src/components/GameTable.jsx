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
    const [cardPut, setCardPut] = useState(false)
    const [selectedCardIndex, setSelectedCardIndex] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [availableSlots, setAvailableSlots] = useState([])
    const [rabbitPut, setRabbitPut] = useState(false)

    const selectCard = (card, index) => {
        setSelectedCardIndex(index)
        setSelectedCard(card)
        setAvailableSlots(availableMoves.availableSlots)
        setSelectedSlot(null)
        setCardPut(false)
        setRabbitPut(false)
    }
    const selectSlot = (x, y) => {
        setSelectedSlot({coordX:x,coordY: y});
        setCardPut(true)
        if(selectedCard==="RABBIT"){
            setRabbitPut(true)
        }else{
            setRabbitPut(false)
        }
    }
    const selectSlotForSwap = (x,y) =>{
        console.log(JSON.stringify({coordX:x,coordY:y}));
    }
    const swapCards = () =>{
        var slots = [selectedSlot]
        for(var i=0; i<largeBoard.length;i++){
            for(var j=0;j<largeBoard[i].length;j++){
                if(largeBoard[i][j]!==null){
                    slots.push({coordX: i,coordY: j});
                }
            }
        }
        setAvailableSlots(slots)
    }
    const cancelMove = () =>{
        setSelectedSlot(null)
        setSelectedCard(null)
        setCardPut(false)
        setSelectedCardIndex(null)
        setAvailableSlots([])
    }

    const isSlotAvailable = (x, y) => {
        return availableSlots.some(obj => obj && ( obj.coordX === x && obj.coordY === y))
    }
    const isSubmitMoveAvailable = () =>{
            return !cardPut

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
                            isSlotAvailable(rowIndex, cellIndex) ?
                                <div key={cellIndex}
                                     className={"availableCell"}
                                     onClick={() => rabbitPut?selectSlotForSwap(rowIndex,cellIndex):selectSlot(rowIndex, cellIndex)}>
                                    {selectedSlot && (rowIndex===selectedSlot.coordX && cellIndex===selectedSlot.coordY)? selectedCard:cell}
                                </div> :
                                <div key={cellIndex}
                                     className={"cell"}>
                                    {selectedSlot && (rowIndex===selectedSlot.coordX && cellIndex===selectedSlot.coordY)? selectedCard:cell}
                                </div>

                        ))}
                    </div>
                ))}
            </div>
            {rabbitPut&&<button onClick={swapCards}>select cards to swap</button>}
            {rabbitPut&&<h3>you can select slots to swap</h3>}
            {/* Rectangular Panels */}
            <div className="hand-container">
                {hand.map((card, index) => (
                    <Card key={index} card={card} onClick={() => {
                        selectCard(card, index)
                    }} selected={selectedCardIndex === index}/>
                ))}
            </div>
            <button disabled={isSubmitMoveAvailable()} onClick={()=>onSubmitMove(selectedCard,selectedSlot)}>submit move</button>
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
