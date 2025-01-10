import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SERVER } from "../../utils/axios";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    checkAuthorizationCode();
  }, []);

  const login = () => {
    const authURL = `${SERVER.auth_uri}/oauth2/authorize?client_id=${SERVER.clientId}&scope=${SERVER.scope}&redirect_uri=${SERVER.callback_uri}&response_type=code`;
    window.location.href = authURL;
  };

  let checkAuthorizationCode = () => {
    let authorizationCode = getUrlParameter("code");
    if (authorizationCode) getAccessToken(authorizationCode);
  };

  let getAccessToken = async (code) => {
    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("code", code);
    data.append("redirect_uri", SERVER.callback_uri);

    const headers = {
      Authorization:
        "Basic " + btoa(SERVER.clientId + ":" + SERVER.clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    };

    var config = {
      baseURL: SERVER.auth_uri,
      method: "post",
      url: "/oauth2/token",
      headers,
      data,
    };

    let response = await axios(config);

    let token = response.data;
    authContext.login(token);
    navigate("/");
  };

  let getUrlParameter = (sParam) => {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");
    var sParameterName;
    var i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");

      if (sParameterName[0] === sParam) {
        return typeof sParameterName[1] === "undefined"
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
    return false;
  };

  return (
    <div className="container h-80">
      <div className="row align-items-center h-100">
        <div className="col-3 mx-auto mt-5">
          <div className="text-center">
            <img
              alt="profile-img"
              className="rounded-circle profile-img-card"
              src="/anonymous.png"
              height={200}
            />
            <form className="form-signin">
              <button
                onClick={login}
                className="btn btn-lg btn-primary btn-block btn-signin"
                type="button"
              >
                LOGIN TO JMASTER.IO
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
