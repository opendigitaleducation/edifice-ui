import { Server, WebSocket } from "mock-socket";
import sinon from "sinon";

export const mockWebSocket = () => {
  const socket = {
    send: () => {},
    addEventListener: sinon.stub(),
    close: () => {},
  };

  sinon.stub(window, "WebSocket").callsFake((url: string) => {
    const mockServer = new Server(url);

    mockServer.on("connection", (socket) => {
      console.log("WS - Connection");
      socket.on("message", () => {
        console.log("WS - Message");
      });
      socket.on("close", () => {
        console.log("WS - Close");
      });
      socket.on("error", () => {
        console.log("WS - Error");
      });

      socket.send("message");
      socket.close();
    });

    return new WebSocket(url);
  });

  return socket;
};
