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
  table.append(thead);
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = col.innerHTML;

      // Add data attributes if present
      if (col.dataset.align) {
        cell.setAttribute('data-align', col.dataset.align);
      }
      if (col.dataset.valign) {
        cell.setAttribute('data-valign', col.dataset.valign);
      }

      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);

  const tableRows = block.querySelectorAll('table tbody tr');
  let trcount = 0;

  if (tableRows) {
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length === 1) {
        trcount = 0;
        row.classList.add('single-column-row');
        const childCount = tableRows[1] ? tableRows[1].childElementCount : 1;
        cells[0].setAttribute('colspan', childCount);
      }
      if (trcount % 2 === 0) {
        row.classList.add('lightgrey');
      }
      trcount += 1;
    });
  }
}
