import api from './axiosClient.js';

export const user = {
	async getAll() {
		const {data} = await api.get('/users');
		return data;
	},
	async createOne({name, password}) {
		const {data} = await api.post('/users', {name, password});
		return data;
	},
	async signInAccount({name, password}) {
		const {data} = await api.post('/sign/in', {name, password});
		return data;
	},
	// 將image_url存入資料庫
	async updateImage({name, image_url}) {
		const {data} = await api.put('/users', {name, image_url});
		return data;
	},
	async getAllMessages() {
		const {data} = await api.get('/message');
		return data;
	},
	async postMessage({name, password, message}) {
		const {data} = await api.post('/message', {name, password, message});
		return data;
	},
	async deleteMessage({name, password, id}) {
		const {data} = await api.post('/message/delete', {name, password, id});
		return data;
	},

};
