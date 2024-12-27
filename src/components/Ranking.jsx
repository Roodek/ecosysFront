import React from 'react';
import PropTypes from 'prop-types';
import '../stylesheets/Ranking.css'

const Ranking = ({ players = [] }) => {
    // Extract unique card types to dynamically create columns for them
    const cardTypes = Array.from(
        new Set(players.flatMap(player => Object.keys(player.finalGeneralPointCount.cardCount)))
    );

    return (
        <div className="ranking-table">
            {/* Header Row */}
            <div className="ranking-header">
                <div className="header-cell name">Name</div>
                <div className="header-cell sum-points">Sum Points</div>
                {cardTypes.map((cardType, index) => (
                    <div key={index} className="header-cell card-type">{cardType}</div>
                ))}
                <div className="header-cell card-type">Number of gaps</div>
                <div className="header-cell card-type">Gap points</div>
            </div>
            {/* Player Rows */}
            {players.map((player, index) => (
                <div key={index} className="ranking-slot">
                    <div className="name">{player.name}</div>
                    <div className="sum-points">{player.pointCount}</div>
                    {cardTypes.map((cardType, idx) => (
                        <div key={idx} className="card-points">
                            {player.finalGeneralPointCount.cardCount[cardType] || 0}
                        </div>
                    ))}
                    <div className="card-points">{player.finalGeneralPointCount.ecosystemGaps} </div>
                    <div className="card-points">{player.finalGeneralPointCount.gapPoints} </div>
                </div>
            ))}
        </div>
    );
};


// Define PropTypes to validate props
Ranking.propTypes = {
    players: PropTypes.array.isRequired
};


export default Ranking;
