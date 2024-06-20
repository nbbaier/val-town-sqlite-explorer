export const sqliteStyle = `
:root {
  --main-font: "Source Sans 3", "Source Sans Pro", -apple-system, system-ui,
    sans-serif;
  --mono-font: "Fira Code", "M Plus Code Latin", monospace, monospace;
  --rhythm: 1.25rem;
  --bg: var(--gray-0);
  --fg: var(--gray-12);
  --accent: #e2e8f0;
  --accent-dark: #cad2da;
  --gray-0: #f8fafb;
  --gray-5: #b1b6b9;
  --gray-12: #121210;
  --density: 1;
  --font-size: 1rem;
  --border-radius: 0.2rem;
  --section-border-weight: 1.5px;
}

* {
  --gap: calc(var(--rhythm) * var(--density));
}

html {
  font-size: var(--font-size);
  font-family: var(--main-font);
  line-height: var(--rhythm);
  color: var(--fg);
  background: var(--bg);
  width: 100%;
}

body {
  margin: 0;
  width: 100%;
}

header {
  border-bottom: var(--section-border-weight) solid black;
}

header > h1 {
  margin-block: 0;
  padding: var(--gap);
  position: relative;
  text-transform: uppercase;
}

h2 {
  text-transform: uppercase;
  margin-top: 0;
}

.tables-list {
  display: flex;
  padding: 0.5rem;
  padding-right: 1rem;
  flex-direction: column;
}

.tables-list-item {
  display: inline-flex;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  justify-content: flex-start;
  align-items: center;
  border-radius: 0.375rem;
  height: 2rem;
  white-space: nowrap;
  cursor: pointer;
  font-size: calc(var(--font-size) * 1);
  line-height: calc(var(--rhythm) * 1);
  & a {
    text-decoration: none;
  }

  & svg {
    margin-right: 8px;
  }
}

.tables-list-item:hover {
  background-color: var(--accent);
}

.tables-list-item.selected {
  background-color: var(--accent-dark);
}

.root-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  max-width: 100%;
  background: var(--bg);
}

.sidebar-layout {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.sidebar {
  width: fit-content;
}

.not-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.not-sidebar > div:first-child {
  padding-top: 0.5rem;
}

.top-container {
  display: flex;
  flex-direction: column;
  min-height: 12rem;
}

.not-sidebar > form {
  margin: 0;
}

.editor {
  height: 12rem;
  flex-grow: 1;
  font-family: var(--mono-font);
  white-space: wrap;
  overflow: auto;
  border-bottom: var(--section-border-weight) solid black;
}

.button-container {
  display: flex;
  align-items: center;
  height: fit-content;
  padding: 8px;
  & button {
    font-size: 1rem;
    font-family: var(--main-font);
    text-transform: capitalize;
    display: flex;
    align-items: center;
    background: var(--bg);
    border: solid 1px black;
    border-radius: var(--border-radius);

    & svg {
      margin-right: 0.25rem;
    }
  }

  & :not(:first-child) {
    margin-inline-start: 0.75rem;
  }

  & button:hover {
    background-color: var(--accent);
  }

  & button:active {
    background-color: var(--accent-dark);
  }
}

.loading {
  font-size: calc(var(--font-size)*0.95)
}

.hidden {
 display: none;
}

.bottom-container {
  flex-shrink: 0;
  padding: 14px;
  overflow: auto; /* code added */
}

.bottom {
  flex: 1;
}

.separator[data-direction="horizontal"],
.separator[data-direction="vertical"] {
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  touch-action: none;
  user-select: none;
}

.separator[data-direction="horizontal"] {
  height: 100%;
  width: var(--section-border-weight);
}

.separator[data-direction="vertical"] {
  height: var(--section-border-weight);
  width: 100%;
}

.resizer[data-direction="horizontal"] > .handle {
  cursor: ew-resize;
}

.resizer[data-direction="vertical"] > .handle {
  cursor: ns-resize;
  transform: rotate(90deg);
}

.handle {
  z-index: 10;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  background-color: #e2e8f0;
  height: 1.25rem;
  width: 1rem;
}

table {
  display: table;
  margin: 0;
  border-collapse: collapse;
}

tfoot,
thead,
tbody {
  text-align: left;
}

thead {
position: sticky;
top: 0;
}

td,
th {
  width: fit-content;
  padding-right: 1rem;
}

th {
  position: sticky;
}

tbody {
  border-block: 1px solid var(--gray-12);
}

.empty-row {
  color: var(--bg);
}

`;
