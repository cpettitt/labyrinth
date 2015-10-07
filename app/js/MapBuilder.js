class MapBuilder {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
  }

  build() {
    const grid = fill2D(this.rows * 2 + 1, this.columns * 2 + 1, "#");

    for (let i = 1; i < grid.length; i += 2) {
      const row = grid[i];
      for (let j = 1; j < row.length; j += 2) {
        row[j] = " ";

        const candidates = [];
        if (i + 2 < grid.length) {
          candidates.push({ i: i + 1, j});
        }
        if (j + 2 < row.length) {
          candidates.push({ i, j: j + 1});
        }

        let candidate;
        if (candidates.length === 1) {
          candidate = candidates[0];
          grid[candidate.i][candidate.j] = " ";
        } else if (candidates.length === 2) {
          const candidate = candidates[Math.floor(Math.random() * 2)];
          grid[candidate.i][candidate.j] = " ";
        }
      }
    }

    grid[grid.length - 2][1] = "^";

    return grid.map(row => row.join("")).join("\n");
  }
}

function fill2D(rows, columns, elem) {
  const array = [];
  for (var i = 0; i < rows; ++i) {
    const row = [];
    for (var j = 0; j < columns; ++j) {
      row.push(elem);
    }
    array.push(row);
  }
  return array;
}

export default MapBuilder;
