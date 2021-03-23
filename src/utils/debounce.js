export default function (fn, delay = 500) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    const context = this;
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay)
  }
}