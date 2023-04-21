import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { InvalidField } from "../components";
import { CSRFSetter, cookieGetter } from "../utils";
import { domainURL } from "../getEnv";

function Register() {

  const navigate = useNavigate()
  const userContext = useContext(UserContext)

  useEffect(() => {
    if (userContext.user.is_authenticated === true) {
      navigate('/')
    } else if (userContext.user.is_authenticated === false) {
      CSRFSetter()
    }
  }, [userContext])

  class Field {
    #isValid;
    constructor(regexp, validators, errorMessage) {
      Object.defineProperties(this, {
        value: {
          value: null,
          writable: true
        },
        regexp: {
          value: regexp,
          writable: false
        },
        validators: {
          value: validators,
          writable: false
        },
        errorMessage: {
          value: errorMessage,
          writable: false
        }
      });
      this.#isValid;
    }
    // Apply given validators and decide whether the field value is valid or invlaid. 
    applyValidators() {
      if (this.value !== '' && this.value !== null) {
        if (this.regexp) {
          if (!this.regexp.test(this.value))
          return false
        }
        if (this.validators) {
          return this.validators.every((validator) => validator(this.value))
        }

        return true
      }
      return null
    }

    isValid() {
      return this.#isValid;
    }

    setValue(newValue) {
      this.value = newValue;
      this.#isValid = this.applyValidators()
    }
  }

  const [fields, setFields] = useState(() => {
    return {
      name: new Field(/^[A-Za-z\s]{4,}$/, [], 'A Name Field Must Not Have Any Special Character Or Numbers.'),
      email: new Field(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,[], 'Invalid Email'),
      password: new Field(/.{8,}/i, [], 'your password must be at least 8 characters'),
      country_id: new Field(),
      birth_date: new Field(null, [(value) => new Date(value).getFullYear() < 1925 ? false : true,], 'You are absolutly dead.'),
      gender: new Field()
    }
  })
  function validateField(event) {
    let { name, value } = event.target;
    setFields(prevFields => {
      let changedField = prevFields[name]
      if (name === 'gender') {
        value==='male'? changedField.setValue(true): changedField.setValue(false)
      } else {
        changedField.setValue(value);
      }
      return {
        ...prevFields,
        [name]: changedField
      }
    })

    // if (name === 'password') {

    //   const specialCharcters = '~`!@#$%^&*()-=_+,<>.?/:;\'"{}[]|\\';
    //   let hasSpecialCharacter = false;
    //   let hasNumber = false;

    //   function changeStrength(content, color) {
    //     passwordStrength.current.textContent = content
    //     passwordStrength.current.style.color = color
    //   }

    //   if (value.length >= 8) {

    //     setIsValid(prevIsValid => ({
    //       ...prevIsValid,
    //       password: true
    //     }))

    //     value.split('').forEach(character => {
    //       if (specialCharcters.includes(character)) {
    //         hasSpecialCharacter = true;
    //       }

    //       if (!isNaN(parseInt(character))) {
    //         hasNumber = true;
    //       }
    //     })


    //     if (hasSpecialCharacter && hasNumber) {
    //       changeStrength('Very Strong Password', 'green')
    //     } else if (!hasSpecialCharacter && !hasNumber) {
    //       changeStrength('Weak Password', 'red')
    //     } else {
    //       changeStrength('Strong Password', 'green')
    //     }

    //   } else {
    //     if (passwordStrength.current.textContent) {
    //       changeStrength('')
    //     }
    //     setIsValid(prevIsValid => ({
    //       ...prevIsValid,
    //       password: false
    //     }))
    //   }


    // } else {
    //   setIsValid(prevIsValid => ({
    //     ...prevIsValid,
    //     [name]: validationRegExps[name].test(value) ? true : !value ? null : false
    //   }))
    // }
  }
  const passwordStrength = useRef()

  // Submitting Registering Data To The Server
  async function register(event) {
    event.preventDefault();

    // Checking if all fields have valid values or not before sending data.
    const fieldsNames = Object.keys(fields)
    

    if (fieldsNames.every(fieldName => fields[fieldName].isValid())) {
      // Gathering data from fields
      let formData = { user: {}, user_profile: {} }
      let AuthenticationFields = ['email', 'password']
      for (const fieldName of fieldsNames) {
        if (AuthenticationFields.includes(fieldName)) {
          formData.user[fieldName] = fields[fieldName].value
        } else {
          formData.user_profile[fieldName] = fields[fieldName].value
        }
      }
      const response = await (await fetch(`${domainURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': cookieGetter('csrftoken')
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      })).json()

      // These errors are errors sent from the backend server if any,
      // but if there are no errors  react-router will navigate to home route.
      const errors = response.errors
      if (errors) {
        console.log(errors)
        document.querySelector(`#email #invalid-message`).textContent = errors['email'] ? errors['email'][0] : ""
      } else {
        console.log(response)
        navigate('/', { state: response.message })
      }
      
    }
  } 
  return (
    <>
      {userContext.user.is_authenticated === false && <form
        id='register-form'
        onSubmit={register}
      >
        <div id="name">
          <label htmlFor="">Full Name:</label>
          <input
            type="text"
            name='name'
            onChange={validateField}
          />
          <InvalidField isValidField={fields.name.isValid()} invlaidMessage={fields.name.errorMessage} />
        </div>
        <div id="email">
          <label htmlFor="">Email: </label>
          <input
            type="email"
            name='email'
            onChange={validateField}
          />
          <br />
          <InvalidField isValidField={fields.email.isValid()} invlaidMessage={fields.email.errorMessage} />
        </div>
        <div id="password">
          <label htmlFor="">Password: </label>
          <input
            type="password"
            name='password'
            min={8}
            onChange={validateField}
          />
          <br />
          <span ref={passwordStrength}></span>
          <InvalidField isValidField={fields.password.isValid()} invlaidMessage={fields.password.errorMessage} />
        </div>
        <div id='country_id'>
          <label htmlFor="">Country:</label>
          <select
            name='country_id'
            onChange={validateField}
          >
            <option value="">Select your country</option>
            <option value={1}>Syria</option>
            {/* {countries? countries.map(country => <option key={country.id} value={country.id}>{ country.name }</option>):null} */}
          </select>
          <InvalidField />
        </div>
        <div id="birth_date">
          <label htmlFor="">Birth Date:</label> 
          <br />
          <input
            type="date"
            name="birth_date"
            onChange={validateField}
          />
          <InvalidField isValidField={fields.birth_date.isValid()} invlaidMessage={fields.birth_date.errorMessage} />
        </div>
        <div id="gender">
          <label>Gender:</label>
          <select
            name="gender"
            onChange={validateField}
          >
            <option value="">Select your gender</option>
            <option value={"male"}>Male</option>
            <option value={"female"}>Female</option>
          </select>
          <InvalidField isValidField={fields.gender.isValid()}/>
        </div>
        <button type="submit">Register</button>
      </form>}
    </>
  )
}

export default Register