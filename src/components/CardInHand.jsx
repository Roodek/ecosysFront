import PropTypes from "prop-types";
import "../stylesheets/CardInHand.css";
import {Image} from "react-bootstrap";
import React from "react";


const CardInHand = ({card, onClick, selected}) => {

    const getTheme=()=>{
        return localStorage.getItem("theme")? localStorage.getItem("theme"):"REGULAR";
    }
    const renderCard = (card) =>{
        return getTheme() === "REGULAR"?
            card:
            <Image src={require("../../public/themes/"+getTheme()+"/"+card+".webp")} fluid/>
    }

    return (<div onClick={onClick} className={selected?"selected-card":"card-in-hand"}>
        {card && renderCard(card)}
    </div>)
};
CardInHand.propTypes = {
    card: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
};

export default CardInHand;
