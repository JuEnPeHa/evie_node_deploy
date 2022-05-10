import axios from 'axios';

const parasAPI = axios.create({
    baseURL: 'https://api-v2-mainnet.paras.id',
});

//parasAPI.get('/top-users?__limit=10')

export default parasAPI;