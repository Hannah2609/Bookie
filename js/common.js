export const baseUrl = 'http://localhost:8080';

export const handleAPIError = function(response) {
    if (response.ok) {
        return response.json();
    }
    console.log('There was an error');
}

export const handleAPIResponseError = (error = 'Generic error') => {
    alert('There was an error: ' + error);
}