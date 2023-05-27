"use client";

import Link from "next/link";

// const Container = styled.div``;

// const Title = styled.h1`
//   font-family: "Galmuri11";
//   font-weight: normal;
// `;

// const TurningBack = styled.div`
//   font-family: "Galmuri11";
//   font-weight: normal;
// `;

export default function NotFound() {
  return (
    <div>
      <h1>존재하지 않는 페이지 입니다.</h1>
      <div>
        <Link href="/">홈페이지로 돌아가기</Link>
      </div>
    </div>
  );
}
