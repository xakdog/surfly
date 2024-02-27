import React, { useEffect, useRef } from "react";
import { canvasManager } from "~/lib/canvas/canvas.manager";
import { CanvasFabric } from "./canvas.fabric";

export const FabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomId = "test";

  const [canvas, setCanvas] = React.useState<CanvasFabric | null>(null);

  useEffect(() => {
    const canvas = canvasManager.getCanvas(roomId, canvasRef.current!);

    canvas.remount(canvasRef.current!);

    setCanvas(canvas);

    return () => {
      setCanvas(null);
      canvasManager.disposeCanvas(roomId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", border: "1px solid black" }}
    />
  );
};
