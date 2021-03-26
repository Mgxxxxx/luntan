export default function bin2base64(blob) {
  // const base64 = window.btoa(
  //   new Uint8Array(arrayBuffer).reduce(
  //     (data, byte) => {
  //       // console.log();
  //       data + String.fromCharCode(byte)
  //     },
  //     ""
  //   )
  // );
  // console.log(base64d);
  // return "data:image;base64," + base64;

  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    }
  })

}