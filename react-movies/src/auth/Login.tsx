import axios from "axios";
import AuthForm from "./AuthForm";
import { authenticationResponse, userCredentials } from "./auth.model";
import { urlAccounts } from "../endpoints";
import { useContext, useState } from "react";
import DisplayErrors from "../utils/DisplayErrors";
import { getClaims, saveToken } from "./handleJWT";
import AuthenticationContext from "./authenticationContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [errors, setErrors] = useState<string[]>([]);
  const {update} = useContext(AuthenticationContext);
  const history = useNavigate();

  async function login(credentials: userCredentials) {
    try {
      setErrors([]);
      const response = await axios.post<authenticationResponse>(
        `${urlAccounts}/login`,
        credentials
      );
      saveToken(response.data);
      update(getClaims());
      history('/');
    } catch (error: any) {
      setErrors(error.response.data);
    }
  }

  return (
    <>
      <h3>Login</h3>
      <DisplayErrors errors={errors} />
      <AuthForm
        model={{ email: "", password: "" }}
        onSubmit={async (values) => await login(values)}
      />
    </>
  );
}
