import axios from 'axios';

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
    //对状态码不为200的进行处理
    if (res.status !== 200) {
        console.error(res);
    }
    //直接返回响应的数据
    return res.data;
}, err => {
    console.log(err);
})

function getImg(img_id) {
    // if (img_id === "") return Promise.resolve("");
    // return request.get(
    //     `/getimg/${img_id}`, {
    //         responseType: "blob",
    //     }
    // )
    if (img_id === "") return "";
    return `/api/getimg/${img_id}`;
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

function selectCommentById(id) {
    return request.get("/selectcommentonid", {
        params: {
            comment_id: Number(id)
        },
    });
}

function selectUserById(id) {
    return request.get("/selectuseronid", {
        params: {
            u_id: Number(id)
        },
    });
}

function selectPostById(id) {
    return request.get("/selectpostonid", {
        params: {
            post_id: Number(id)
        },
    });
}

function createPost(u_id, post_name, post_txt, post_txthtml) {
    return request.post("/createpost", JSON.stringify({
        u_id,
        post_name,
        post_txt,
        post_txthtml
    }))
}

function createComment(post_id, u_id, comment_txt) {
    post_id = Number(post_id);
    u_id = Number(u_id);
    return request.post("createcomment", JSON.stringify({
        post_id,
        u_id,
        comment_txt
    }))
}

function allCommentIdsOnPostId(post_id) {
    post_id = Number(post_id);
    return request.get("/allcommentidonpostid", {
        params: {
            post_id
        },
    });
}

function allPostIds() {
    return request.get("allpostid");
}

function allPostIdsByUid(u_id) {
    u_id = Number(u_id);
    return request.get("allpostidonuid", {
        params: {
            u_id
        }
    });
}

function deletePostById(post_id) {
    post_id = Number(post_id);
    return request.post("deletepostonid", JSON.stringify({
        post_id
    }))
}

function login(u_name, u_password) {
    return request.get("/login", {
        params: {
            u_name,
            u_password
        }
    });
}

export {
    login,
    getImg,
    uploadImg,
    delCommentById,
    selectCommentById,
    selectUserById,
    selectPostById,
    createPost,
    createComment,
    allCommentIdsOnPostId,
    allPostIds,
    allPostIdsByUid,
    deletePostById,
};