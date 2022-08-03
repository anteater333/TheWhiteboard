import React from "react";
import logo from "./logo.svg";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./App.scss";

function App() {
  return (
    <GoogleOAuthProvider clientId="tmp">
      <div className="App">
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
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
