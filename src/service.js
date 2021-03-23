import axios from 'axios';
// import http from 'http';
// import https from 'https';

const service = axios.create({
    baseURL: 'http://47.119.115.208:15656',
    headers: {
        // "Content-Type": "application/json; charset=utf-8"
    },
    timeout: 2000,
    // validateStatus: (status) => {
    //     return status >= 200 && status < 300;
    // },
    // httpAgent: new http.Agent({
    //     keepAlive: true
    // }),
    // httpsAgent: new https.Agent({
    //     keepAlive: true
    // }),
})

service.interceptors.request.use(config => {
    // console.log(config);
    return config;
}, err => {
    console.log(err);
})

const get = (url, data) => {
    return service({
        methods: 'get',
        url,
        params: data
    })
};
const post = (url, data) => {
    console.log(url, data);
    return service({
        methods: 'post',
        url,
        data
    })
};
const _delete = (url, data) => {
    return service({
        methods: 'delete',
        url,
        ...data
    })
};
const put = (url, data) => {
    return service({
        methods: 'put',
        url,
        data
    })
};

// export default {
//     get,
//     post,
//     _delete,
//     put
// };

export default service;