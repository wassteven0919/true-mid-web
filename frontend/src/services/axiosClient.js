import axios from 'axios';

const api = axios.create({
	// BaseURL: 'https://website.r11942184.140-112-18-210.nip.io:8000/api/v1',
	baseURL: '/api/v1',
});

export default api;
