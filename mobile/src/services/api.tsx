import axios from 'axios';

const baseURL: string = `http://192.168.15.9:3333/`;

const api = axios.create({
    baseURL: baseURL
});


export default api;