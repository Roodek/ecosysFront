import PropTypes from "prop-types";
import "../stylesheets/CardInHand.css";


const CardInHand = ({card, onClick, selected}) => {

    return (<div onClick={onClick} className={selected?"selectedCard":"card"}>
        {card}
    </div>)
};
CardInHand.propTypes = {
    card: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
};

export default CardInHand;
