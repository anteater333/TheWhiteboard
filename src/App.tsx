import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./App.scss";

const clientId =
  "706303852091-uqhi736g8tqcm4un3s2usu1qa0t0avdb.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
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
            useOneTap
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
