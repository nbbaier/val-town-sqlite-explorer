// import { createApp } from "jsr:@pomdtr/val-town-sqlite-explorer@0.0.3";
import { createApp } from "./src/mod.tsx";

const app = createApp({
  token: Deno.env.get("VALTOWN_TOKEN"),
});

export default app;
