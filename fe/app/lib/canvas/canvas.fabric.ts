import { fabric } from "fabric";
import { CanvasSocket } from "~/lib/canvas/canvas.socket";

export class CanvasFabric {
  private canvas: fabric.Canvas;
  private socket: CanvasSocket;

  constructor(roomId: string, canvasElement: HTMLCanvasElement) {
    this.socket = new CanvasSocket(roomId);
    this.canvas = new fabric.Canvas(canvasElement, {
      isDrawingMode: true,
    });
  }

  init() {
    // Set some initial drawing settings
    this.canvas.freeDrawingBrush.width = 5; // Brush width
    this.canvas.freeDrawingBrush.color = "#000000"; // Brush color

    this.canvas.setHeight(window.innerHeight - 128);
    this.canvas.setWidth(window.innerWidth - 48);

    this.canvas.on("path:created", (event) => {
      // FIXME: figure out why TS is complaining
      // @ts-ignore
      const pathData = event.path.toJSON();
      console.log(pathData);

      // Send the drawing data to the server
      this.socket.sendDrawingData(pathData);
    });

    this.socket.setDrawingCallback((data) => {
      // Data contains path data, update the canvas with it
    });
  }

  remount(canvasElement: HTMLCanvasElement) {
    this.canvas.dispose();
    this.canvas = new fabric.Canvas(canvasElement, {
      isDrawingMode: true,
    });
    this.init();
  }

  clear() {
    this.canvas.clear();
    this.socket.clearCanvas();
  }

  dispose() {
    this.canvas.dispose();
    this.socket.dispose();
  }
}
