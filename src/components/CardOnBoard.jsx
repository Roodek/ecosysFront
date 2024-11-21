import PropTypes from "prop-types";
import "../stylesheets/CardOnBoard.css";
import React from "react";


const CardOnBoard = ({card, onClick, state}) => {

    const calculateClassForCell = () => {
        switch(state){
            case "AVAILABLE":
                return "available-cell"
            case "SELECTED":
                return "selected-cell"
            default:
                return "cell"
        }
    }
    return (
        <div
            className={calculateClassForCell()}
            onClick={onClick}>
            {card}
         </div>
    )
};
CardOnBoard.propTypes = {
    card: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    state: PropTypes.string.isRequired
};

export default CardOnBoard;
