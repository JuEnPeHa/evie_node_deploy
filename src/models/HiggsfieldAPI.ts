import axios from 'axios';

const higgsfieldAPI = axios.create({
    baseURL: 'https://higgsfield.io/api/v1',
});

//higgsfieldAPI.get('/calendar/main_page')
//higgsfieldAPI.get('/search/main_statistics')
//higgsfieldAPI.get('/search/popular')
// higgsfieldAPI.post('/search/search', {
//     "next_id":null,"limit":25,"days":1000,"name":"collectables"
// })
//higgsfieldAPI.get('/collections/get/{customURLorID}')

export default higgsfieldAPI;