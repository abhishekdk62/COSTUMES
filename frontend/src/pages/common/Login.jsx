import React, { useState } from "react";
import Header from "../../components/common/Header";
import LoginForm from "../../components/common/LoginForm";
import ForgotPassword from "../../components/common/ForgotPassword";

const Login = () => {
  const [forgotPassword, setForgotPassword] = useState(false);

  return (
    <div className="overflow-hidden">
      <Header />
      {forgotPassword ? (
        <ForgotPassword setForgotPassword={setForgotPassword} />
      ) : (
        <LoginForm setForgotPassword={setForgotPassword} />
      )}
    </div>
  );
};

export default Login;
