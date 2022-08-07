import React, { useCallback } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import "./App.scss";
import { Route, Routes, useNavigate } from "react-router-dom";
import Whiteboard from "./whiteboard";

const clientId =
  "706303852091-uqhi736g8tqcm4un3s2usu1qa0t0avdb.apps.googleusercontent.com";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
      </Routes>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const handleOnLoginSuccess = useCallback(
    (credential: CredentialResponse) => {
      console.log(credential);
      navigate("/whiteboard");
    },
    [navigate]
  );
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <header className="App-header">
        <div className="App-title">
          <label className="title-the unselectable">{"The"}</label>
          <label className="title-whiteboard unselectable">
            {"Whiteboard"}
          </label>
        </div>
      </header>
      <div className="App-content">
        <GoogleLogin
          onSuccess={handleOnLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
