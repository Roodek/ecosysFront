import React from 'react';
import PropTypes from 'prop-types';
import '../stylesheets/Ranking.css'

const Ranking = ({players = []}) => {
    return (
        <div className="ranking-table">
            {players.map((player, index) => (
                <div key={index} className="ranking-slot">
                    <div className={"name"}> {player.name}</div>
                    <div className={"sum-points"}>{player.pointCount}</div>
                    <div className={"card-points"}>{Object.entries(player.finalGeneralPointCount.cardCount)
                        .map(([key, val]) => (
                            <div key={[key]} className="category">
                                <div>{[key]}</div>
                                <div>{[val]}</div>
                            </div>))
                    }
                    </div>
                </div>))}
        </div>
    );
};

// Define PropTypes to validate props
Ranking.propTypes = {
    players: PropTypes.array.isRequired
};


export default Ranking;
