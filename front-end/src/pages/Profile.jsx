import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts";
function Profile() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userContext.user.is_authenticated) {
      navigate("/login");
    }
  }, [userContext]);
  return (
    <>
      <div>{JSON.stringify(userContext)}</div>
    </>
  );
}

export default Profile;
