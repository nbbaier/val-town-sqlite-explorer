import { LibsqlError, type TransactionMode } from "@libsql/client";
import { z } from "zod";

/* Open in Val Town: https://www.val.town/v/std/sqlite */
export const API_URL =
  Deno.env.get("VALTOWN_API_URL") ?? "https://api.val.town";

export function createSqlite(token: string) {
  /**
   * Every Val Town account comes with its own private
   * [SQLite database](https://www.sqlite.org/) that
   * is accessible from any of your vals.
   * ([Docs â†—](https://docs.val.town/std/sqlite))
   */
  return {
    /**
     * Executes a SQLite statement.
     *
     * @param {InStatement} statement - The SQLite statement to execute.
     * @example String query:
     * `sqlite.execute("SELECT 1;")`
     * @example Query with arguments:
     * `sqlite.execute({sql: "SELECT * from books WHERE year > ?;", args: [2020]})`
     */
    execute,

    /**
     * Executes a batch of SQLite statements.
     *
     * @param {InStatement[]} statements - An array of SQLite statements to execute.
     * @param {TransactionMode} [mode] - The transaction mode for the batch execution.
     */
    batch,
  };

  // ------------
  // Functions
  // ------------

  async function execute(statement: InStatement): Promise<ResultSet> {
    const res = await fetch(`${API_URL}/v1/sqlite/execute`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ statement }),
    });
    if (!res.ok) {
      throw createResError(await res.text());
    }
    return res.json();
  }

  async function batch(
    statements: InStatement[],
    mode?: TransactionMode
  ): Promise<ResultSet[]> {
    const res = await fetch(`${API_URL}/v1/sqlite/batch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ statements, mode }),
    });
    if (!res.ok) {
      throw createResError(await res.text());
    }
    return res.json();
  }

  function createResError(body: string) {
    try {
      const e = zLibsqlError.parse(JSON.parse(body));
      // e.message already contains the code, and LibsqlError adds the
      // code to the beginning, so we remove it here
      const msg = e.message.replace(e.code, "").replace(/^:\s+/, "");
      return new LibsqlError(msg, e.code, e.rawCode);
    } catch (_) {
      // Failed to parse libsql error
    }
    return new Error(body);
  }
}

// ------------
// Helpers
// ------------

const zLibsqlError = z.object({
  message: z.string(),
  code: z.string(),
  rawCode: z.number().optional(),
});

// We patch these types to only support JSON values
export type InValue = null | string | number | boolean;
export type InArgs = Array<InValue> | Record<string, InValue>;
export type InStatement =
  | {
      /**
       * The SQL statement to execute.
       */
      sql: string;

      /**
       * The arguments to bind to the SQL statement.
       */
      args: InArgs;
    }
  | string;
export interface ResultSet {
  /** Names of columns.
   *
   * Names of columns can be defined using the `AS` keyword in SQL:
   *
   * ```sql
   * SELECT author AS author, COUNT(*) AS count FROM books GROUP BY author
   * ```
   */
  columns: Array<string>;

  /** Types of columns.
   *
   * The types are currently shown for types declared in a SQL table. For
   * column types of function calls, for example, an empty string is
   * returned.
   */
  columnTypes: Array<string>;

  /** Rows produced by the statement. */
  rows: Array<Array<any>>;

  /** Number of rows that were affected by an UPDATE, INSERT or DELETE operation.
   *
   * This value is not specified for other SQL statements.
   */
  rowsAffected: number;

  /** ROWID of the last inserted row.
   *
   * This value is not specified if the SQL statement was not an INSERT or if the table was not a ROWID
   * table.
   */
  lastInsertRowid: bigint | undefined;
}
