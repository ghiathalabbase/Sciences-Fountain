import { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CSRFSetter, cookieGetter } from "../utils";
import { UserContext } from "../contexts";
import { domainURL } from "../getEnv";

function Login() {
  const [message, setMessage] = useState(null);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (userContext.user.is_authenticated === true) {
      navigate("/");
    } else if (userContext.user.is_authenticated === false) {
      CSRFSetter();
    }
  }, [userContext]);

  async function login(event) {
    setMessage("Logging In...");
    event.preventDefault();
    const form = document.getElementById("login-form");
    const credentials = Object.fromEntries(new FormData(form));
    const response = await fetch(`${domainURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": cookieGetter("csrftoken"),
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    const data = await response.json();
    if (data.is_authenticated) {
      userContext.setUser(data);
    } else {
      setMessage(data);
    }
  }
  return (
    userContext.user.is_authenticated === false && (
      <>
        <form id="login-form" onSubmit={login} method="post">
          <label htmlFor="">Email: </label>
          <input type="text" placeholder="othman@gmail.com" name="email" />
          <br />
          <label htmlFor="">Password: </label>
          <input type="password" name="password" />
          <button type="submit">Login</button>
        </form>
        {message}
        <NavLink to="/register">Sign up</NavLink>
      </>
    )
  );
}

export default Login;
