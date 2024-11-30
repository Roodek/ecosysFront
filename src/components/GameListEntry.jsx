import React from 'react';
import PropTypes from 'prop-types';

const GameListEntry = ({ numberOfPayers='0',gameID='', playerNames='No description provided', onClick=() => {} }) => {
    return (
        <div className="list-entry" onClick={onClick} style={styles.entry}>
            <h3 style={styles.title}>Number of players: {numberOfPayers}</h3>
            <p>gameID: {gameID}</p>
            <p style={styles.description}> players: {playerNames}</p>
        </div>
    );
};

// Define PropTypes to validate props
GameListEntry.propTypes = {
    numberOfPayers: PropTypes.string.isRequired,
    gameID: PropTypes.string.isRequired,
    playerNames: PropTypes.string,
    onClick: PropTypes.func
};


// Basic inline styles for the component
const styles = {
    entry: {
        padding: '10px',
        border: '5px solid #ddd',
        borderRadius: '4px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        backgroundColor: '#34db5e',
    },
    title: {
        margin: '0 0 5px 0',
        fontSize: '18px',
    },
    description: {
        margin: 0,
        fontSize: '14px',
        color: '#555',
    }
};

export default GameListEntry;
