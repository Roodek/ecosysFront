import PropTypes from "prop-types";
import "../stylesheets/CardInHand.css";
import {Image, OverlayTrigger, Tooltip} from "react-bootstrap";
import React from "react";


const CardInHand = ({card, onClick, selected}) => {

    const getTheme = () => {
        return localStorage.getItem("theme") ? localStorage.getItem("theme") : "REGULAR";
    }
    const renderCard = (card) => {
        return getTheme() === "REGULAR" ?
            card :
            <Image src={require("../../public/themes/" + getTheme() + "/" + card + ".webp")} fluid/>
    }
    const renderRule = (card) => {
        switch (card) {
            case 'FOX':
                return <div>3 when <strong>not</strong> adjacent to <strong>Wolf</strong> or <strong>Bear</strong>.
                </div>
            case 'WOLF':
                return <div><p> I - 12</p>
                    <p>II - 8</p>
                    <p>III - 4.</p>
                </div>
            case 'BEE':
                return <div>3 for each adjacent <strong>Meadow</strong></div>
            case 'BEAR':
                return <div>2 for each adjacent <strong>Fish</strong> or <strong>Bee</strong></div>
            case 'MEADOW':
                return <div><p>1->0,</p><p> 2->3,</p> <p>3->6,</p><p> 4->10,</p><p>5+->15</p></div>
            case 'RIVER':
                return <div>I->8, II->5</div>
            case 'EAGLE':
                return <div>2 for each <strong>Fish</strong> or <strong>Rabbit</strong> in range <strong>2</strong>
                </div>
            case 'RABBIT':
                return <div><strong>1</strong></div>
            case 'DRAGONFLY':
                return <div>1 for the length of each adjacent <strong>River</strong></div>
            case 'FISH':
                return <div>2 for each adjacent <strong>Dragonfly</strong> or <strong>River</strong></div>
            case 'ELK':
                return <div>2 for each row and column with an <strong>Elk</strong></div>
            default:
                return null
        }
    }

    return (
        <OverlayTrigger
            placement={"bottom"}
            overlay={
                <Tooltip>
                    <div>{renderRule(card)}</div>
                </Tooltip>
            }
            container={document.body}
            style={{position:"fixed"}}
        >
            <div onClick={onClick} className={selected ? "selected-card" : "card-in-hand"}>
                {card && renderCard(card)}
            </div>
        </OverlayTrigger>
    )
};
CardInHand.propTypes = {
    card: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
};

export default CardInHand;
