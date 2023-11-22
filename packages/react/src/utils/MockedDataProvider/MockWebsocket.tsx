import { Server, WebSocket } from "mock-socket";
import sinon from "sinon";

export const mockWebSocket = () => {
  const socket = {
    send: () => {},
    addEventListener: sinon.stub(),
    close: () => {},
  };

  // Simulez la réponse du serveur WebSocket
  socket.addEventListener.withArgs("open", sinon.match.func).callsArg(1);
  socket.addEventListener
    .withArgs("message", sinon.match.func)
    .callsArgWith(1, { data: "response" });
  socket.addEventListener.withArgs("close", sinon.match.func).callsArg(1);
  socket.addEventListener.withArgs("send", sinon.match.func).callsArg(1);

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
