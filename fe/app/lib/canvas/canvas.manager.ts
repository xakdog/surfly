import { CanvasFabric } from "./canvas.fabric";

const CANVAS_DISPOSE_TIMEOUT = 10000; // Dispose after 10 seconds

/**
 * We manage canvas outside of React components to simplify the code and avoid
 * unnecessary re-renders. This class is responsible for creating and disposing
 * canvas instances.
 */
class CanvasManager {
  private canvases: { [roomId: string]: CanvasFabric };
  private disposeTimeouts: { [roomId: string]: NodeJS.Timeout };

  constructor() {
    this.canvases = {};
    this.disposeTimeouts = {};
  }

  getCanvas(roomId: string, canvasElement: HTMLCanvasElement) {
    clearTimeout(this.disposeTimeouts[roomId]);

    if (!this.canvases[roomId]) {
      this.canvases[roomId] = new CanvasFabric(roomId, canvasElement);
    }

    return this.canvases[roomId];
  }

  disposeCanvas(roomId: string) {
    const disposeAfter = CANVAS_DISPOSE_TIMEOUT; // Dispose after 10 seconds
    this.disposeTimeouts[roomId] = setTimeout(() => {
      if (!this.canvases[roomId]) return;

      this.canvases[roomId].dispose();
      delete this.canvases[roomId];
    }, disposeAfter);
  }
}

export const canvasManager = new CanvasManager();
