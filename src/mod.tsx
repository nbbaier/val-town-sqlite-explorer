/* Open in Val Town: https://www.val.town/v/nbbaier/sqliteExplorerApp */
/** @jsxImportSource hono/jsx **/

import { resetStyle } from "./reset-style.ts";
import { EditorSection, Separator, Table, TablesList } from "./components.tsx";
import { sqliteStyle } from "./style.ts";
import { createSqlite } from "./sqlite.ts";
import type { FC } from "hono/jsx";
import { jsxRenderer } from "hono/jsx-renderer";
import papa from "papaparse";
import { Hono } from "hono";

const HTML: FC = ({ children }) => {
  return (
    <html>
      <head>
        <title>SQLite Explorer</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: resetStyle }} />
        <style dangerouslySetInnerHTML={{ __html: sqliteStyle }} />

        <script src="https://unpkg.com/htmx.org@1.9.9/dist/htmx.min.js">
        </script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <script type="module" src="https://esm.town/v/nbbaier/resizeScript" />
        <script
          type="module"
          src="https://esm.town/v/nbbaier/tableSelectScript"
        />
        <script
          type="module"
          src="https://raw.esm.sh/code-mirror-web-component@0.0.20/dist/code-mirror.js"
        >
        </script>
      </head>
      <body _="
      on keydown[event.metaKey and key is 'Enter'] log 'command + enter' then send submitForm to #sql-editor
      ">
        <div class="root-container">
          <header>
            <h1>SQLite Explorer</h1>
          </header>
          {children}
        </div>
        <script type="module" src="https://esm.town/v/nbbaier/downloadScript" />
        <script
          type="module"
          src="https://esm.town/v/nbbaier/enableButtonsScript"
        />
        <script type="module" src="https://esm.town/v/nbbaier/getCodeScript" />
      </body>
    </html>
  );
};

export function createApp(options?: {
  token?: string;
}) {
  const token = options?.token || Deno.env.get("valtown");
  if (!token) {
    throw new Error("missing valtown token");
  }

  const sqlite = createSqlite(token);
  const app = new Hono();
  app.use(
    "*",
    jsxRenderer(
      ({ children }) => {
        return <HTML children={children} />;
      },
      { docType: false },
    ),
  );

  app.get("/", async (c) => {
    let data = await sqlite.batch([
      `SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';`,
      `SELECT name FROM sqlite_schema WHERE type ='view' AND name NOT LIKE 'sqlite_%';`,
    ]);

    let views = data[1].rows.map((view) => {
      return { type: "view", name: view[0] };
    });

    let tables = data[0].rows.map((view) => {
      return { type: "table", name: view[0] };
    });

    return c.render(
      <main class="sidebar-layout">
        <div class="sidebar">
          <TablesList tables={[...tables, ...views]}></TablesList>
        </div>
        <Separator direction="horizontal"></Separator>
        <div class="not-sidebar">
          <EditorSection />
          <Separator direction="vertical" isResizer={true}></Separator>
          <div class="bottom-container">
            <div id="results-table" class="bottom"></div>
          </div>
        </div>
      </main>,
    );
  });

  app.post("/query", async (c) => {
    const query = (await c.req.parseBody()).query as string;

    try {
      console.log(`attempting:`, query);
      const rs = await sqlite.execute(query);
      const headers = rs.columns;
      const rows = rs.rows;
      return c.html(
        <div>
          <Table
            headers={headers}
            rows={rows}
            style="overflow-x='scroll'"
          >
          </Table>
        </div>,
      );
    } catch (err) {
      console.log(err);
      return c.html(
        <div style="color:  #962020;">
          <b>{err.message}</b>
        </div>,
      );
    }
  });

  app.get("/download/:filetype", async (c) => {
    const { filetype } = await c.req.param();
    const q = c.req.query("query");
    if (!q) {
      return new Response(`query parameter is required`, {
        status: 400,
      });
    }
    try {
      const res = await sqlite.execute(q);
      const { columns, rows } = res;
      const jsonResult = rows.map((row) => {
        return Object.fromEntries(
          columns.map((key, i) => {
            return [key, row[i]];
          }),
        );
      });

      if (filetype == "csv") {
        const csv = papa.unparse(jsonResult);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="results.csv"',
          },
        });
      } else if (filetype == "json") {
        return Response.json(jsonResult, {
          headers: {
            "Content-Disposition": 'attachment; filename="results.json"',
          },
        });
      }
    } catch (err) {
      return new Response(`failed to run query`, {
        status: 500,
      });
    }
  });

  return app;
}
