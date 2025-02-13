const API_BASE_URL = process.env.REACT_APP_API_URL;

export const apiRequest = async (endpoint, method = 'GET', data = null, isAuth = true) => {
    const headers = { 'Content-Type': 'application/json' };

    if (isAuth) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const options = {
        method,
        headers,
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
};

export const loginUser = async (credentials) => apiRequest('account/login', 'POST', credentials, false);
