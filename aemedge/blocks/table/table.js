/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

function buildCell(rowIndex) {
  const cell = rowIndex
    ? document.createElement('td')
    : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) {
    table.append(thead);
  }
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);

  let tableRows = '';
  if (block.classList.contains('schedule')) {
    const scheduletableRows = block.querySelectorAll('table tbody tr');
    tableRows = scheduletableRows;
  } else if (block.classList.contains('playoffs')) {
    const playoffstableRows = block.querySelectorAll('table tbody tr');
    tableRows = playoffstableRows;
  }
  let trcount = 0;
  if (tableRows) {
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length === 1) {
        trcount = 0;
        row.classList.add('single-column-row');
        for (let i = 0; i < tableRows[1].childElementCount - 1; i += 1) {
          const newCell = document.createElement('td');
          row.appendChild(newCell);
        }
      }
      if (trcount % 2 === 0) {
        row.classList.add('lightgrey');
      }
      trcount += 1;
    });
  }
}
