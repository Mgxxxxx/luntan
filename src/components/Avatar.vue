<template>
  <div>
    <file-upload
      v-model="file"
      ref="upload"
      @input-file="inputFile"
      :post-action="postUrl"
      accept="image/png,image/gif,image/jpeg,image/webp"
    >
      <slot>
        <button>Browse</button>
        <input type="file" id="browse" />
      </slot>
    </file-upload>
    <br />
    <button class="btn btn-primary" @click="submit">Upload</button>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import FileUpload from "vue-upload-component";

export default defineComponent({
  name: "Avatar",
  components: { FileUpload },
  props: ["postUrl"],
  setup() {
    const file = ref([]);
    const upload = ref(null);
    const data = ref({});

    const inputFile = (newFile, oldFile) => {
      if (newFile && !oldFile) {
        // add
        console.log("add", newFile);
      }
      if (newFile && oldFile) {
        // update
        console.log("update", newFile);
      }
      if (!newFile && oldFile) {
        // remove
        console.log("remove", oldFile);
      }
    };

    const submit = () => {
      upload.value.active = true;
    };

    return {
      file,
      upload,
      data,
      inputFile,
      submit,
    };
  },
});
</script>

<style scoped lang="scss">
</style>
