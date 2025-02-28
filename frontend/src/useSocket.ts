import { useEffect, useState } from "react";
import { INIT_GAME, MOVE, GAME_OVER, UPDATE_BOARD } from "./App";
import { Chess, Color, PieceSymbol, Square } from "chess.js";

export const WS_URL = "ws://localhost:8080";

export type Board = ({
  square: Square | "";
  type: PieceSymbol | "";
  color: Color | "";
} | null)[][];

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState<Board>(chess.board());
  const [history, setHistory] = useState(chess.history({ verbose: true }));
  const [active, setActive] = useState(false);
  const [color, setColor] = useState<Color>("w");

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => setSocket(ws);
    ws.onclose = () => setSocket(null);
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          console.log(
            `Game Initialised You are playing as ${message.payload.color}`,
          );
          setBoard(fillBoard(chess.board()));
          setColor(message.payload.color);
          setActive(chess.turn()===color);
          break;
        case MOVE:
          console.log("Update Move: ", message.payload);
          chess.move(message.payload.move);
          setBoard(fillBoard(chess.board()));
          setActive(chess.turn()===color);
          break;
        case UPDATE_BOARD:
          console.log("Update Board:", message.payload);
          chess.load(message.payload.fen);
          setBoard(fillBoard(chess.board()));
          setColor(message.payload.color);
          setActive(chess.turn()===color);
          break;
        case GAME_OVER:
          console.log("Game Ended:", message.payload);
          break;
      }
      setHistory(chess.history({ verbose: true }));
    };
  }, [socket]);

  return { socket, chess, board, history, active, color };
};

function fillBoard(board: Board): Board {
  return board.map((row, i) =>
    row.map((cell, j) => {
      let sq: Square = `${"abcdefgh"[j]}${8 - i}` as Square;
      cell ??= { square: sq, type: "", color: "" };
      return cell;
    }),
  );
}
