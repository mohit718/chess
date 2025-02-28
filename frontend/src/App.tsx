import { useRef, useState } from "react";
import "./App.css";
import { useSocket } from "./useSocket";
import { ChessBoard } from "./components/ChessBoard";
import { ScoreBoard } from "./components/ScoreBoard";

// TODO: move to common location
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const WAITING = "wating";
export const UPDATE_BOARD = "update_board";

function App() {
  const landingSection = useRef<HTMLDivElement>(null);
  const playSection = useRef<HTMLDivElement>(null);

  const { socket, board, history, chess, color } = useSocket();
  if (!socket) return <h4>Connecting....</h4>;
  const initGame = (): void => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      }),
    );
    landingSection.current?.classList.add("animate-exit");
    // playSection.current?.classList.add("animate-entry");
  };

  const makeMove = (move: { from?: string; to?: string }) => {
    console.log("MOVE: ", move);
    socket.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      }),
    );
  };

  return (
    <main className="relative flex min-h-screen min-w-screen flex-col items-center justify-center bg-gray-700 text-center text-gray-200">
      <div
        ref={landingSection}
        className="fixed z-20 flex h-full w-full flex-col items-center justify-center backdrop-blur-sm"
      >
        <div className="flex max-w-screen-md flex-col items-center justify-evenly gap-6 rounded-3xl bg-gray-800/70 p-8 lg:p-20">
          <h1 className="text-3xl font-bold lg:text-6xl">Welcome To Chess</h1>
          <button
            onClick={() => initGame()}
            className="mx-auto rounded-xl border border-pink-600 bg-pink-600 p-6 py-4 text-2xl font-bold shadow-pink-500 transition-transform hover:scale-105 hover:cursor-pointer hover:shadow-[0px_0px_1px_1px_#fff]"
          >
            Play Online
          </button>
        </div>
      </div>
      <div
        ref={playSection}
        className="z-10 grid h-full grid-cols-1 gap-y-2 lg:grid-cols-3"
      >
        {/* make isActive more effective */}
        <h6 className="col-span-2 my-2 text-left text-sm font-bold text-gray-300">
          {chess.turn() === "w" ? "White" : "Black"} to play.
        </h6>
        <ChessBoard
          className="col-span-2"
          board={board}
          onMove={makeMove}
          isActive={true}
          turn={chess.turn()}
          color={color}
        />
        <ScoreBoard
          className="col-span-1 mx-auto bg-gray-200/30 backdrop-blur-xs px-4"
          onMove={makeMove}
          history={history}
        />
      </div>
    </main>
  );
}

export default App;
