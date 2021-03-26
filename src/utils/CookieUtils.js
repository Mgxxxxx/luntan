const CookieUtil = {
  get(name) {
    let cookieName = encodeURIComponent(name) + "=";
    // console.log(name);
    let cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null;

    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    // console.log(cookieValue);
    return cookieValue;
  },

  set(name, value, age = 24 * 60 * 60 * 1000, path, domain, secure) { //有效期默认一天
    if (!name && !value) {
      console.error('set cookie fail');
      return;
    }
    let cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    // if (expires instanceof Date) {
    //   cookieText += "; expires=" + expires.toGMTString();
    // }
    let expires = new Date();
    expires.setTime(expires.getTime() + age)
    cookieText += "; expires=" + expires.toGMTString();
    if (path) {
      cookieText += "; path=" + path;
    }
    if (domain) {
      cookieText += "; domain=" + domain;
    }
    if (secure) {
      cookieText += "; secure=" + secure;
    }
    document.cookie = cookieText;
  },

  unset(name, path, domain, secure) {
    this.set(name, "", new Date(0), path, domain, secure);
  }
}

export default CookieUtil;