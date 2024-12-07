import PropTypes from "prop-types";
import "../stylesheets/CardOnBoard.css";
import React, {useEffect} from "react";
import {Image} from "react-bootstrap";


const CardOnBoard = ({card, onClick, state}) => {


    const calculateClassForCell = () => {
        switch (state) {
            case "AVAILABLE":
                return "available-cell"//availableCell
            case "SELECTED":
                return "selected-cell"//selectedCell
            case "CARD_PUT":
                return "submitted-cell"//submittedCell
            default:
                return "cell"//regularCell
        }
    }
    // const availableCell = {
    //     width: "60px",
    //     height: "60px",
    //     backgroundColor: "#9ed974",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     border: "3px solid #456e34",
    //     borderRadius: "4px",
    //     fontSize: "14px",
    //     textAlign: "center",
    //     cursor: "pointer",
    // };
    // const selectedCell = {
    //     width: "60px",
    //     height: "60px",
    //     backgroundColor: "#efe680",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     border: "3px solid #456e34",
    //     borderRadius: "4px",
    //     fontSize: "14px",
    //     textAlign: "center",
    //     cursor: "pointer",
    // };
    // const submittedCell = {
    //     width: "60px",
    //     height: "60px",
    //     backgroundColor: "84af56",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     border: "3px solid #456e34",
    //     borderRadius: "4px",
    //     fontSize: "14px",
    //     textAlign: "center",
    //     cursor: "pointer",
    // };
    // const regularCell = {
    //     width: "60px",
    //     height: "60px",
    //     backgroundColor: "#f0f0f0",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     border: "3px solid #456e34",
    //     borderRadius: "4px",
    //     fontSize: "14px",
    //     textAlign: "center",
    // };

    const getTheme=()=>{
        return localStorage.getItem("theme")? localStorage.getItem("theme"):"REGULAR";
    }
    const renderCard = (card) =>{
        return getTheme() === "REGULAR"?
            card:
            <Image src={require("../../public/themes/"+getTheme()+"/"+card+".webp")} fluid/>
        }
    return (
        <div
            className={calculateClassForCell()}
            onClick={onClick}>
            {card && renderCard(card)}

        </div>
    )
};
CardOnBoard.propTypes = {
    card: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    state: PropTypes.string.isRequired
};

export default CardOnBoard;
