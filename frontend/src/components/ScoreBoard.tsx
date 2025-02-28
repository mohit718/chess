import { Move, SQUARES } from "chess.js";
import React, { HTMLAttributes, useState } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  onMove: ({}: { from?: string; to?: string }) => void;
  history: Move[];
}

export const ScoreBoard: React.FC<Props> = ({ history, onMove, ...props }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  console.log(history);
  return (
    <div {...props}>
      <h3 className="p-4 text-xl font-bold">Outstandings</h3>
      <div className="max-h-[550px] w-full overflow-x-auto bg-slate-500 text-center">
        <div className="grid grid-cols-3 bg-slate-800 p-2 px-4">
          <h4>#</h4>
          <h4>from</h4>
          <h4>to</h4>
        </div>
        <div className="flex flex-col-reverse">
            {history.length === 0 && (
              <h4 className="w-full">No moves made yet.</h4>
            )}
          {history.map((move, k) => (
            <div
              key={k}
              className={`${move.color === "w" ? "bg-gray-300" : "bg-gray-200"} grid grid-cols-3 font-semibold tracking-wider text-gray-700 p-1 px-2`}
            >
              <h4>{k + 1}</h4>
              <div className="flex items-center">
                <img
                  src={
                    move.color === "w"
                      ? `/assets/pieces/w${move.piece}.png`
                      : `/assets/pieces/b${move.piece}.png`
                  }
                  className="aspect-auto max-w-5"
                  alt={move.from}
                />
                <span>
                  {move.piece}
                  {move.from}
                </span>
              </div>
              <div className="flex items-center">
                <img
                  src={
                    move.color === "w"
                      ? `/assets/pieces/w${move.piece}.png`
                      : `/assets/pieces/b${move.piece}.png`
                  }
                  alt={move.to}
                  className="aspect-auto max-w-5"
                />
                <span>
                  {move.piece}
                  {move.to}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <datalist id="cells">
          {SQUARES.map((cell) => (
            <option key={cell} value={cell}>
              {cell}
            </option>
          ))}
        </datalist>
        <div className="grid grid-cols-3">
          <input
            className="bg-gray-400 p-2 text-slate-900"
            placeholder="From"
            list="cells"
            name="from"
            id="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            className="bg-gray-400 p-2 text-slate-900"
            placeholder="To"
            list="cells"
            name="to"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <button
            onClick={() => onMove({ from, to })}
            type="button"
            className=" bg-gray-700 p-2 font-bold text-gray-200 hover:bg-gray-600"
          >
            MOVE
          </button>
        </div> */}
    </div>
  );
};
