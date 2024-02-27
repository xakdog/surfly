import type { MetaFunction } from "@remix-run/node";
import { FabricCanvas } from "~/lib/canvas/canvas";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Future canvas</h1>
      <FabricCanvas />
    </div>
  );
}
