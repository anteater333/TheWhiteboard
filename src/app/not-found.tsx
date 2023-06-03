"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center font-galmuri">
      <h1 className="-mt-16 text-2xl font-bold">
        존재하지 않는 페이지 입니다.
      </h1>
      <div className="mt-4 text-xl hover:underline">
        <Link href="/">홈페이지로 돌아가기</Link>
      </div>
    </div>
  );
}
