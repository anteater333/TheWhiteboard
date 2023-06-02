import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonType = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const AddButton = function (props: ButtonType) {
  return (
    <button
      {...props}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-center text-6xl text-white shadow-circle active:shadow-none"
    >
      <span className="pb-2 text-center">+</span>
    </button>
  );
};

export const OnGoingMemoButton = function (props: ButtonType) {
  return (
    <button
      {...props}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-white pl-1 text-center font-galmuri text-5xl text-black shadow-circle active:shadow-none"
    >
      <span className="pb-2 text-center">ㅁ</span>
    </button>
  );
};
