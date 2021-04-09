import {
  delCommentById
} from "@/service";

import store from "@/store";

export async function delComment(commentId, parent) {
  let res, info = {
    msg: "",
    status: ""
  };
  // console.log(parent.ctx);
  try {
    res = await delCommentById(commentId);
    if (res.state === 1) {
      info.msg = "删除评论成功";
      info.status = "alert-success";
      parent.ctx.commentIds.splice(parent.ctx.commentIds.indexOf(commentId), 1);
    } else {
      info.msg = "删除评论失败";
      info.status = "alert-danger";
    }
    store.commit("alert", info);
  } catch (error) {
    console.warn(error);
    store.commit("alert", info);
  }
}