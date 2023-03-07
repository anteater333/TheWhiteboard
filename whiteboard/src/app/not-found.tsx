"use client";

import Link from "next/link";
import styled from "styled-components";

const Container = styled.div``;

const Title = styled.h1`
  font-family: "Galmuri11";
  font-weight: normal;
`;

const TurningBack = styled.div`
  font-family: "Galmuri11";
  font-weight: normal;
`;

export default function NotFound() {
  return (
    <Container>
      <Title>존재하지 않는 페이지 입니다.</Title>
      <TurningBack>
        <Link href="/">홈페이지로 돌아가기</Link>
      </TurningBack>
    </Container>
  );
}
