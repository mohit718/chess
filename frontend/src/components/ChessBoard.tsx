import { Square, PieceSymbol, Color } from "chess.js";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { Board } from "../useSocket";

interface Props extends HTMLAttributes<HTMLDivElement> {
  board: Board;
  isActive: boolean;
  turn: Color;
  color: Color;
  onMove: ({}: { from?: string; to?: string }) => void;
}

export const ChessBoard: React.FC<Props> = ({
  board,
  isActive,
  turn,
  color,
  onMove,
  ...props
}) => {
  const [from, setFrom] = useState<Square | "">();
  return (
    <div {...props}>
      
      <div
        className={`flex h-auto ${color === "w" ? "flex-col" : "flex-col-reverse"}`}
      >
        {board.map((row, i) => (
          <div key={i} className="flex items-center justify-center text-center">
            {row.map((cell, j) => {
              cell ??= { square: "", type: "", color: "" };
              return (
                <div
                  onClick={() => {
                    if (isActive) {
                      if (!from && cell && cell.type) {
                        setFrom(cell.square);
                      } else if (from && cell) {
                        onMove({ from, to: cell.square });
                        setFrom(undefined);
                      }
                    }
                  }}
                  role="button"
                  key={j}
                  className={`${
                    (i + j) % 2 == 0 ? "bg-green-500" : "bg-gray-500"
                  } ${cell.color == "w" ? "text-gray-200" : "text-gray-900"} ${from === cell.square ? "bg-orange-700" : ""} flex aspect-square h-11 items-center justify-center border border-slate-400 p-1 text-2xl font-extrabold transition-all hover:cursor-pointer hover:bg-slate-500 hover:text-3xl xl:h-20 lg:h-18 md:h-16`}
                >
                  <img
                    src={
                      cell.color === "w"
                        ? `/assets/pieces/w${cell.type}.png`
                        : `/assets/pieces/b${cell.type}.png`
                    }
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
