export default function Memo() {
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
}

export const Board = function () {
  return (
    <div>
      <Memo />
    </div>
  );
};
