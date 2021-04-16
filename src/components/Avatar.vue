<template>
  <div>
    <div>
      <input
        type="file"
        class="file-input"
        id="validatedInputGroupCustomFile"
        required
        accept="image/*"
        @change="update"
      />
      <label for="validatedInputGroupCustomFile">
        <div class="btn btn-primary">Upload</div>
      </label>
    </div>
    <div
      v-show="isUpdating"
      class="position-fixed"
      style="top: 25%; left: 0; right: 0; z-index: 999"
    >
      <div class="container">
        <div class="img-container-padding-top"></div>
        <div class="img-container">
          <img src="" ref="img" alt="" />
        </div>
        <div class="button-container">
          <slot>
            <div id="btn" type="button" @click="sureSave(crop)">裁剪</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default defineComponent({
  name: "Avatar",
  props: ["postUrl"],
  setup(props, ctx) {
    const img = ref(null);
    const isUpdating = ref(false);
    const crop = ref(null);

    const update = (e) => {
      // console.log(e.target.files);
      const file = e.target.files[0];
      const url = window.URL.createObjectURL(file);
      img.value.src = url;
      if (!crop.value) {
        crop.value = new Cropper(img.value, {
          viewMode: 1,
          dragMode: "none",
          initialAspectRatio: 1,
          aspectRatio: 1,
          background: false,
          autoCropArea: 0.6,
          zoomOnWheel: false,
        });
      } else {
        // console.log("replace");
        crop.value.replace(url);
      }
      isUpdating.value = true;
      e.target.value = "";
    };

    const sureSave = (crop) => {
      // console.log("save");
      isUpdating.value = false;
      // const canvas = crop.getCroppedCanvas({
      //   imageSmoothingQuality: "high",
      // });
      const canvas = crop.getCroppedCanvas();
      const afterImg = canvas.toDataURL("image/jpeg");
      canvas.toBlob(
        (blob) => {
          ctx.emit("upload", blob, afterImg);
        },
        "image/jpeg",
        1
      );
    };

    return {
      img,
      isUpdating,
      crop,
      sureSave,
      update,
    };
  },
});
</script>

<style scoped lang="scss">
.file-input {
  width: 0;
  height: 0;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.img-container-padding-top {
  height: 20px;
  background-color: #000;
  opacity: 0.5;
}
.img-container {
  height: 400px;
  overflow: hidden;
}
.button-container {
  background-color: #000;
  opacity: 0.5;
  padding: 20px 0;
}
.button-container #btn {
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
}
</style>
