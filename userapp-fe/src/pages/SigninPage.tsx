
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";


export const SigninPage = () => {

  const jwt = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt) {
      navigate("/transfer", { replace: true });
    }
  });

  if (jwt) {
    return null;
  }

  return <div>
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signin" />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  </div>
}