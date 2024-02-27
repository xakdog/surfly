const WS_PORT = 8822;

export class CanvasSocket {
  private ws: WebSocket;
  private roomId: string;
  private drawingCallback?: (data: any) => void;

  constructor(roomId: string) {
    console.log("Creating socket for room", roomId);
    this.roomId = roomId;
    this.ws = new WebSocket(`ws://localhost:${WS_PORT}`);

    this.ws.onopen = () => {
      // Connection is open, join the room
      this.send({ type: "joinRoom", roomId: this.roomId });
    };

    this.ws.onmessage = (event) => {
      // Received a message
      const data = JSON.parse(event.data);
      if (data.type === "drawing") {
        // Handle drawing data
        console.log("Received drawing data", data);
        // Update the canvas with received drawing data
        this.drawingCallback?.(data);
      }
    };

    this.ws.onerror = (event) => {
      // Error occurred
      console.error("WebSocket error", event);
    };
  }

  private send(data: Object) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("Socket is not open");
    }

    this.ws.send(JSON.stringify(data));
  }

  sendDrawingData(data: any) {
    this.send({ type: "drawing", roomId: this.roomId, data });
  }

  clearCanvas() {
    this.send({ type: "clearCanvas", roomId: this.roomId });
  }

  dispose() {
    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("Socket is not open");
    }

    this.send({ type: "leaveRoom", roomId: this.roomId });
    this.ws.close();
  }

  setDrawingCallback(callback: (data: any) => void) {
    this.drawingCallback = callback;
  }
}
