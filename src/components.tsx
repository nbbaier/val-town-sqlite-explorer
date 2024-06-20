/** @jsxImportSource hono/jsx **/

import { RunSVG, TableSVG, ViewSVG } from "./svg.tsx";
import type { FC } from "hono/jsx";

export const TablesList: FC = (props) => {
    return (
        <div class="tables-list">
            {/* <summary>Tables ({props.tables.length})</summary> */}
            {props.tables.map((item: any) => {
                return (
                    <div
                        class="tables-list-item"
                        id={item.name}
                        _="
              on click
                if I do not match .selected
                  remove .selected from .tables-list-item
                  then
                  add .selected to me
                else
                  remove .selected from me
            "
                    >
                        {item.type === "table" ? <TableSVG /> : <ViewSVG />}
                        {item.name}
                    </div>
                );
            })}
        </div>
    );
};

export const Separator: FC = (props) => {
    const isResizer = props.isResizer;
    if (isResizer) {
        return (
            <div
                id={`${props.direction}-separator`}
                class="separator resizer"
                data-direction={props.direction}
            >
                <div class="handle">
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                        >
                        </path>
                    </svg>
                </div>
            </div>
        );
    }
    return (
        <div
            id={`${props.direction}-separator`}
            class="separator"
            data-direction={props.direction}
        >
        </div>
    );
};

export const EditorSection: FC = () => {
    return (
        <form
            class="top-container"
            id="sql-editor"
            hx-target="#results-table"
            hx-post="/query"
            hx-vals="js:{query: getCode()}"
            hx-trigger="submit, submitForm from:body"
            _="
        on submitForm log 'got submitForm'
        on submit log 'submitting'
    "
            hx-indicator=".htmx-indicator"
        >
            <div>
                <code-mirror
                    class="editor"
                    name="query"
                    id="editordiv"
                    language="sql"
                    code=""
                >
                </code-mirror>
            </div>

            <div class="button-container">
                <button id="run">
                    <RunSVG />
                    Run
                </button>
                <button
                    id="download-json"
                    type="button"
                >
                    Download JSON
                </button>
                <button
                    id="download-csv"
                    type="button"
                >
                    Download CSV
                </button>

                <span
                    class="htmx-indicator loading hidden"
                    _="on load remove .hidden from me"
                >
                    loading...
                </span>
            </div>
        </form>
    );
};

export const Table: FC = (props) => {
    const headers = props.headers as string[];
    const rows = props.rows as string[][];

    const createRows = (rows: any, headers: any) => {
        if (rows.every((subArray: any) => subArray.length === 0)) {
            const emptyRow = headers.map((header: any) => {
                return <td class="empty-row">A</td>;
            });

            return <tr>{emptyRow}</tr>;
        }

        return rows.map((row: any) => (
            <tr>
                {row.map((cell: any) => <td>{cell}</td>)}
            </tr>
        ));
    };

    const tableRows = createRows(rows, headers);

    return (
        <table>
            <thead>
                <tr>
                    {headers.map((header) => <th>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </table>
    );
};

export const MockTable: FC<{ h: number; r: number }> = ({ h, r }) => {
    const createHeaders = (h: number) => {
        let headers: string[] = [];
        for (let i = 0; i < h; i++) {
            headers.push(`Header ${i}`);
        }
        return headers;
    };

    const createRows = (h: number, r: number) => {
        let rows: string[][] = [];
        for (let i = 0; i < r; i++) {
            let row: string[] = [];
            for (let j = 0; j < h; j++) {
                row.push(`Row ${i} Col ${j}`);
            }
            rows.push(row);
        }
        return rows;
    };

    return (
        <table>
            <thead>
                <tr>
                    {createHeaders(h).map((header) => <th>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {createRows(h, r).map((row: string[]) => {
                    return row.map((col) => {
                        return (
                            <tr>
                                <td>{col}</td>
                            </tr>
                        );
                    });
                })}
            </tbody>
        </table>
    );
};
