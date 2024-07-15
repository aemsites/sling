/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function hasWrapper(el) {
  return (
    !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block'
  );
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('div');
    summary.className = 'summary accordion-item-label';
    summary.append(...label.childNodes);
    if (!hasWrapper(summary)) {
      summary.innerHTML = `<p>${summary.innerHTML}</p>`;
    }
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    if (!hasWrapper(body)) {
      body.innerHTML = `<p>${body.innerHTML}</p>`;
    }
    // decorate accordion item
    const details = document.createElement('div');
    details.classList.add('details', 'accordion-items');
    details.append(summary, body);
    row.replaceWith(details);
  });

  const questions = block.querySelectorAll('.accordion-items .summary');
  questions.forEach((item) => {
    item.addEventListener('click', () => {
      const answer = item.nextSibling;
      const faqitem = item.parentElement;
      faqitem.classList.toggle('open');
      if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
      } else {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}
