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
    timeout: 5000,
    withCredentials: true
})

request.interceptors.request.use(config => {
    // console.log(config);
    return config;
}, err => {
    console.log(err);
})

request.interceptors.response.use(res => {
    if (res.status !== 200) {
        console.log(res);
    }
    return res.data;
}, err => {
    console.log(err);
})

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

function delCommentById(id) {
    return request.post("deletecommentonid", {
        comment_id: Number(id)
    })
}

export {
    request,
    getImg,
    uploadImg,
    delCommentById
};