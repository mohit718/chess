import { BLACK, Chess, Color, WHITE } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE, UPDATE_BOARD } from "./Messages";

type User = {
  socket: WebSocket;
  color?: Color;
};

export class Game {
  public player1: User;
  public player2: User;
  private chess: Chess;
  private moves: string[];
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = { socket: player1, color: WHITE };
    this.player2 = { socket: player2, color: BLACK };
    this.chess = new Chess();
    this.moves = [];
    this.startTime = new Date();
    console.log("INSIDE GAME CONST()");
    this.player1.socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "w",
        },
      })
    );
    this.player2.socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "b",
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: { from: string; to: string; promotion?: string }
  ) {
    // validate Is this users turn
    let currentUser: User;
    let opponent: User;
    if (this.player1.socket === socket) {
      currentUser = this.player1;
      opponent = this.player2;
    } else if (this.player2.socket === socket) {
      currentUser = this.player2;
      opponent = this.player1;
    } else throw new Error("Invalid State");
    if (this.chess.turn() !== currentUser.color) return;

    try {
      //  Push the move
      move.promotion ??= "q";
      this.chess.move(move);

      //  Check if game is over
      if (this.chess.isGameOver()) {
        this.player1.socket.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: move,
          })
        );
        this.player2.socket.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: { color: this.chess.turn() },
          })
        );
      }

      // this.player1.socket.send(
      //   JSON.stringify({
      //     type: UPDATE_BOARD,
      //     payload: {
      //       fen: this.chess.fen(),
      //       turn: this.chess.turn(),
      //     },
      //   })
      // );
      // this.player2.socket.send(
      //   JSON.stringify({
      //     type: UPDATE_BOARD,
      //     payload: {
      //       fen: this.chess.fen(),
      //       turn: this.chess.turn(),
      //     },
      //   })
      // );

      currentUser.socket.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move,
          },
        })
      );
      opponent.socket.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}
