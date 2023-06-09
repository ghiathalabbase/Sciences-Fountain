import { domainURL } from "./getEnv";

function cookieGetter(cookieName) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, cookieName.length + 1) === cookieName + "=") {
                cookieValue = decodeURIComponent(cookie.substring(cookieName.length + 1));
                break;
            }
        }
      }
    return cookieValue;
}
async function CSRFSetter() {
    const response =  fetch(`${domainURL}/get-csrftoken`, {
      method: 'GET',
        credentials: 'include'
    })
}
  
  
export {cookieGetter, CSRFSetter}