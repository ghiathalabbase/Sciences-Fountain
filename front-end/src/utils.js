import { domainURL, apiURL } from "./getEnv";

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
  const response = fetch(`${apiURL}get-csrftoken`, {
    method: "GET",
    credentials: "include",
  });
}

function collapse(event) {
  const links = document.querySelectorAll(".collapsable");
  const toggleBtn = document.querySelectorAll(".toggle");
  if (event.target !== toggleBtn && event.target !== links) {
    links.forEach((element) => element.classList.remove("open"));
    toggleBtn.forEach((element) => element.classList.remove("clicked"));
  }
}

class Field {
  #isValid;
  constructor(regexp, validators, errorMessage) {
    Object.defineProperties(this, {
      value: {
        value: null,
        writable: true,
      },
      regexp: {
        value: regexp,
        writable: false,
      },
      validators: {
        value: validators,
        writable: false,
      },
      errorMessage: {
        value: errorMessage,
        writable: false,
      },
    });
    this.#isValid;
  }
  // Apply given validators and decide whether the field value is valid or invlaid.
  applyValidators() {
    if (this.value !== "" && this.value !== null) {
      if (this.regexp) {
        if (!this.regexp.test(this.value)) return false;
      }
      if (this.validators) {
        return this.validators.every((validator) => validator(this.value));
      }

      return true;
    }
    return null;
  }

  isValid() {
    return this.#isValid;
  }

  setValue(newValue) {
    this.value = newValue;
    this.#isValid = this.applyValidators();
  }
}

function isEmptyObject(object) {
  if (object.constructor !== Object) {
    throw TypeError("'object' constructor must be 'Object'");
  }
  for (const prop in object) {
    return false;
  }
  return true;
}
export { cookieGetter, CSRFSetter, collapse, Field, isEmptyObject };
