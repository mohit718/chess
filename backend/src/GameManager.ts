import { WebSocket } from "ws";
import { INIT_GAME, MOVE, WAITING } from "./Messages";
import { Game } from "./Game";

type Message = {
  type: string;
  payload?: any;
};

export class GameManager {
  games: Game[];
  private users: WebSocket[];
  private pendingUser: WebSocket | null;  
  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
    console.log("USER ADDED");
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    console.log("USER REMOVED");
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message: Message = JSON.parse(data.toString());
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          this.initGame(socket);
          break;
        case MOVE:
          if (message.payload) this.findGameAndMove(socket, message.payload);
          break;
      }
    });
  }
  private initGame(socket: WebSocket) {
    console.log("INITIATING GAME");
    if (this.pendingUser) {
      const game = new Game(this.pendingUser, socket);
      this.games.push(game);
      this.pendingUser = null;
    } else {
      this.pendingUser = socket;
    }
  }
  private findGameAndMove(
    socket: WebSocket,
    move: { from: string; to: string }
  ) {
    const game = this.games.find(
      (g) => g.player1.socket === socket || g.player2.socket === socket
    );
    if (game) {
      game.makeMove(socket, move);
    } else {
      console.log("Wating");
      socket.send(
        JSON.stringify({
          type: WAITING,
          payload: "Wating for other player.",
        })
      );
    }
  }
}
