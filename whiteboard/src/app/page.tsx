"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import styled from "styled-components";

import { unselectable } from "@/style/properties";
import { appear } from "@/style/animations";

const clientId =
  "706303852091-uqhi736g8tqcm4un3s2usu1qa0t0avdb.apps.googleusercontent.com";

// #region styles

const FrontPage = styled.div`
  font-family: "Galmuri11";
  text-align: center;
  animation: ${appear} 2s;
`;
const Header = styled.header`
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 1em;
`;
const Title = styled.div`
  font-size: 4rem;
  ${unselectable}
`;
const TitleThe = styled.label`
  font-size: 0.75em;
`;
const TitleWhiteboard = styled.label`
  font-size: 1.25em;
  font-weight: bold;
`;
const Content = styled.div`
  background-color: #fefeff;
  min-height: 50vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

// #endregion

export default function Home() {
  const router = useRouter();

  const handleOnLoginSuccess = useCallback(
    (credential: CredentialResponse) => {
      console.log(credential);
      router.push("/board");
    },
    [router]
  );

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <FrontPage>
          <Header>
            <Title>
              <TitleThe>{"The"}</TitleThe>
              <TitleWhiteboard>{"Whiteboard"}</TitleWhiteboard>
            </Title>
          </Header>
          <Content>
            <GoogleLogin
              onSuccess={handleOnLoginSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </Content>
        </FrontPage>
      </GoogleOAuthProvider>
    </>
  );
}
