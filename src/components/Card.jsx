import PropTypes from "prop-types";
import "../stylesheets/Card.css";


const Card = ({card, onClick, selected}) => {

    return (<div onClick={onClick} className={selected?"selectedCard":"card"}>
        {card}
    </div>)
};
Card.propTypes = {
    card: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
};

export default Card;
