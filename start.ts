import * as fs from "fs";

import { createRequestHandler } from "@remix-run/server-runtime";

// @ts-expect-error
import * as build from "./build";

let requestHandler = createRequestHandler(build, "production");

export default {
  async fetch(request: Request) {
    try {
      let filepath = `./public/${request.url}`;
      let stats = fs.statSync(filepath);
      if (stats.mode !== 16877) {
        let file = Bun.file(filepath);
        return new Response(await file.arrayBuffer(), {
          headers: {
            "Content-Type": file.type,
          },
        });
      }
    } catch (err) {
      console.log({ err });
    }

    return requestHandler(
      new Request("http://localhost:3000" + request.url, request)
    );
  },
};
