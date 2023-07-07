import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { motion } from "framer-motion";

type ButtonType = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  isActive?: boolean;
};

export const AddButton = function (props: ButtonType) {
  return (
    <button
      {...props}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-center text-6xl text-white shadow-circle active:shadow-none"
    >
      <motion.div
        className="h-16 w-16 text-center leading-[3.4rem]"
        animate={{
          rotate: props.isActive ? 180 : 0,
        }}
      >
        +
      </motion.div>
    </button>
  );
};

export const OnGoingMemoButton = function (props: ButtonType) {
  return (
    <button
      {...props}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 pl-1 text-center font-galmuri text-5xl text-black shadow-circle active:shadow-none"
    >
      <span className="pb-1 text-center">ㅁ</span>
    </button>
  );
};
