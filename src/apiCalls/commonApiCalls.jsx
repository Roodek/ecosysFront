export const createNewGame = () => {
    return fetch(process.env.REACT_APP_API_URL + '/games/new', {
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json', // Set the appropriate headers, such as content type
            // Add other headers if needed, like Authorization
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the response as JSON
        })

}

export const joinGame = (gameID, playerName) => {
    return fetch(process.env.REACT_APP_API_URL + '/games/' + gameID + '/join', {
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json', // Set the appropriate headers, such as content type
            // Add other headers if needed, like Authorization
        },
        body: JSON.stringify({
            playerName: playerName
        }) // Convert the request body to a JSON string
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the response as JSON
        })
}
