import { useEffect, useState } from "react";
import "./App.css";

const n = 10;

type RegexExpr = {
  expr: RegExp;
  satisfied: boolean;
};

const defaultRowsExpr = [
  ".*",
  "([^A]|AB)*",
  "B.*",
  "[^B]*(IM|XA)*",
  "C.*C.*",
  "(AB|CA)\\1.*",
  "(IM|CA|ME)*B(HOU|BU)*",
  "[ABC]*",
  ".*(.)(.).*\\1\\2.*",
  "[^ABC]*ABC[^ABC]*",
];
const defaultColsExpr = [
  "([^B]|BA)",
  ".*",
  "C.*B",
  ".*C.*C.*C",
  "A.*B.*",
  ".*(.)(.).*\\2\\1\\2",
  "C.*B*",
  "[ABC][^ABC]*",
  "A.*[ABC]*",
  "CA*(IM|CA)*",
];

function App() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [regexRows, setRegexRows] = useState<RegexExpr[]>([]);
  const [regexCols, setRegexCols] = useState<RegexExpr[]>([]);

  useEffect(() => {
    const grid = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push("");
      }

      grid.push(row);
    }

    setGrid(grid);

    const regexRows = [];
    for (let i = 0; i < n; i++) {
      const expr = new RegExp(`^${defaultRowsExpr[i]}$`);
      const value = {
        expr,
        satisfied: false,
      };

      regexRows.push(value);
    }

    setRegexRows(regexRows);

    const regexCols = [];
    for (let i = 0; i < n; i++) {
      const expr = new RegExp(`^${defaultColsExpr[i]}$`);
      const value = {
        expr,
        satisfied: false,
      };
      regexCols.push(value);
    }

    setRegexCols(regexCols);
  }, []);

  useEffect(() => {
    if (grid.length === 0) return;
    if (regexRows.length !== n) return;
    if (regexCols.length !== n) return;

    const nextRows = regexRows.map((value, i) => {
      return {
        expr: value.expr,
        satisfied: checkRow(i, value.expr),
      };
    });
    setRegexRows(nextRows);

    const nextCols = regexCols.map((value, i) => {
      return {
        expr: value.expr,
        satisfied: checkCol(i, value.expr),
      };
    });

    setRegexCols(nextCols);
  }, [grid]);

  function checkRow(index: number, expr: RegExp) {
    const text = grid
      .map((_v, i) => (grid[index][i] !== "" ? grid[index][i] : " "))
      .join("");
    // if (index === 1) console.log(text, expr.test(text));
    return expr.test(text);
  }

  function checkCol(index: number, expr: RegExp) {
    const text = grid
      .map((_v, i) => (grid[i][index] !== "" ? grid[i][index] : " "))
      .reverse()
      .join("");
    return expr.test(text);
  }

  function updateGrid(row_index: number, col_index: number, value: string) {
    const tGrid = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        if (i == row_index && j == col_index) row.push(value);
        else row.push(grid[i][j]);
      }

      tGrid.push(row);
    }
    setGrid(tGrid);
  }

  return (
    <div className="grid">
      {grid.map((row, i) => (
        <div key={i} className="row">
          <div
            className={`regex-expr-row${
              regexRows[i].satisfied ? " satisfied" : ""
            }`}
          >
            {regexRows[i].expr.source.slice(1, -1)}
          </div>
          {row.map((col, j) => (
            <div key={j} className="col">
              {i == 0 ? (
                <div
                  className={`regex-expr-col${
                    regexCols[j].satisfied ? " satisfied" : ""
                  }`}
                >
                  {regexCols[j].expr.source.slice(1, -1)}
                </div>
              ) : (
                <></>
              )}
              <input
                type="text"
                maxLength={1}
                onChange={(e) => updateGrid(i, j, e.target.value.toUpperCase())}
                value={col}
              ></input>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
