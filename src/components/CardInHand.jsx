import PropTypes from "prop-types";
import "../stylesheets/CardInHand.css";
import {Image, OverlayTrigger, Tooltip} from "react-bootstrap";
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
    const renderRule = (card) => {
        switch (card) {
            case 'FOX':
                return <p>3 when <strong>not</strong> adjacent to <strong>Wolf</strong> or <strong>Bear</strong>.</p>
            case 'WOLF':
                return <p><p> I - 12</p>
                    <p>II - 8</p>
                    <p>III - 4.</p>
                </p>
            case 'BEE':
                return <p>3 for each adjacent <strong>Meadow</strong></p>
            case 'BEAR':
                return <p>2 for each adjacent <strong>Fish</strong> or <strong>Bee</strong></p>
            case 'MEADOW':
                return <p><p>1->0,</p><p> 2->3,</p> <p>3->6,</p><p> 4->10,</p><p>5+->15</p></p>
            case 'RIVER':
                return <p>I->8, II->5</p>
            case 'EAGLE':
                return <p>2 for each <strong>Fish</strong> or <strong>Rabbit</strong> in range <strong>2</strong></p>
            case 'RABBIT':
                return <p><strong>1</strong></p>
            case 'DRAGONFLY':
                return <p>1 for the length of each adjacent <strong>River</strong></p>
            case 'FISH':
                return <p>2 for each adjacent <strong>Dragonfly</strong> or <strong>River</strong></p>
            case 'ELK':
                return <p>2 for each row and column with an <strong>Elk</strong></p>
            default:
                return null
        }
    }

    return (<div onClick={onClick} className={selected ? "selected-card":"card-in-hand"}>
        <OverlayTrigger
            placement={"bottom"}
            overlay={
                <Tooltip>
                    {renderRule(card)}
                </Tooltip>
            }
        >
            {card && renderCard(card)}
        </OverlayTrigger>
    </div>)
};
CardInHand.propTypes = {
    card: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
};

export default CardInHand;
