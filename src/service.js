import axios from 'axios';
// import http from 'http';
// import https from 'https';

const request = axios.create({
    // baseURL: 'http://47.119.115.208:15656',
    // baseURL: 'http://192.168.2.212:15656',
    baseURL: '/api',
    headers: {
        "Content-Type": "application/json; charset=utf-8",
    },
    timeout: 2000,
    withCredentials: true
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

request.interceptors.request.use(config => {
    // console.log(config);
    return config;
}, err => {
    console.log(err);
})

// request.interceptors.response.use(config => {
//     return config;
// }, err => {
//     console.log(err);
// })

const get = (url, data) => {
    return request({
        methods: 'get',
        url,
        params: data
    })
};
const post = (url, data) => {
    console.log(url, data);
    return request({
        methods: 'post',
        url,
        data
    })
};
const _delete = (url, data) => {
    return request({
        methods: 'delete',
        url,
        ...data
    })
};
const put = (url, data) => {
    return request({
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

function getImg(img_id) {
    if (img_id === "") return Promise.resolve("");
    return request.get(
        "/getimg", {
            params: {
                img_id
            },
            responseType: "blob",
        }
    )
}

function uploadImg(data) {
    return request.post("/uploadimg", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
    })
}

export {
    request,
    getImg,
    uploadImg
};