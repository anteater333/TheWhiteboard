export const Memo = function () {
  return (
    <div>
      <div>
        <label className="text-9xl">{"Hello Memo"}</label>
      </div>
      <div>
        <label>{"This is a body."}</label>
      </div>
    </div>
  );
};

/**
 * The Whiteboard. Memo들의 집합.
 * @returns
 */
export const Board = function () {
  return (
    <div>
      <Memo />
    </div>
  );
};
