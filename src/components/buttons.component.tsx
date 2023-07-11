import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { motion } from "framer-motion";

type ButtonType = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  isActive?: boolean;
};

export const AddButton = function ({ isActive, ...props }: ButtonType) {
  return (
    <button
      {...props}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-center text-6xl text-white shadow-circle active:shadow-none"
    >
      <motion.div
        className="h-16 w-16 text-center leading-[3.4rem]"
        animate={{
          rotate: isActive ? 135 : 0,
        }}
      >
        +
      </motion.div>
    </button>
  );
};

export const OnGoingMemoButton = function ({
  isActive: _,
  ...props
}: ButtonType) {
  return (
    <button
      {...props}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 pl-1 text-center font-galmuri text-5xl text-black shadow-circle active:shadow-none"
    >
      <span className="pb-1 text-center">ㅁ</span>
    </button>
  );
};

export const PositionConfirmButton = function ({
  texts,
  isActive,
  ...props
}: ButtonType & {
  texts: { state1Text: string; state2Text: string; keyText: string };
}) {
  return (
    <button {...props} className="pb-2 font-galmuri text-2xl font-bold">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-40 rounded-xl border-[1px] bg-stone-100 px-3 py-4 shadow-circle active:shadow-none"
      >
        {isActive ? texts.state1Text : texts.state2Text}
        <br />
        <div className="-mt-1 h-4 text-base">{texts.keyText}</div>
      </motion.div>
    </button>
  );
};
