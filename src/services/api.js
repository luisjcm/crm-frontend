import axios from 'axios';

// Creamos una instancia de Axios con la URL de nuestra API
const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export default api;