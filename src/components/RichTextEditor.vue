<template>
  <editor id="tinymce" @keyup="change" v-model="content" :init="init" />
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import Editor from "@tinymce/tinymce-vue";

import _ from "lodash";

import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";

export default defineComponent({
  name: "",
  components: { Editor },
  setup(props, ctx) {
    let content = ref("");
    const init = {
      skin_url: "/skins/ui/oxide",
      height: 300,
      plugins: "link lists image code table wordcount",
      // toolbar:
      //   "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat",
      branding: false,
    };

    onMounted(() => {
      tinymce.init({});
    });

    //需使用防抖函数优化
    const change = _.debounce(() => {
      // console.log(content.value);
      const text = content.value.replace(/<.+?>/g, "");
      ctx.emit("updateContent", content.value, text);
    }, 500);

    return reactive({
      content,
      init,
      change,
    });
  },
});
</script>

<style scoped lang="scss">
</style>
