import axios from "axios";

const statsParasAPI = axios.create({
    baseURL: 'https://stats.paras.id/api/collections',
});

export default statsParasAPI;