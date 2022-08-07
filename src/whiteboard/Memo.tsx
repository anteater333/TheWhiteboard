import React from "react";
import "./Whiteboard.scss";

function Memo() {
  return (
    <div className="memo">
      <div className="memo-header">
        <label className="memo-header-title unselectable">{"Hello Memo"}</label>
      </div>
      <div className="memo-content">
        <label className="memo-content-text unselectable">
          {"This is a memo."}
        </label>
      </div>
    </div>
  );
}

export default Memo;
