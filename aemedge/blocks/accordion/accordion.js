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
  const faqData = []; // Array to collect FAQ data

  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('div');
    summary.className = 'summary accordion-item-label';
    summary.append(...label.childNodes);
    if (!hasWrapper(summary)) {
      summary.innerHTML = `${summary.innerHTML}`;
    }
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    if (!hasWrapper(body)) {
      body.innerHTML = `${body.innerHTML}`;
    }
    // decorate accordion item
    const details = document.createElement('div');
    details.classList.add('details', 'accordion-items');
    details.append(summary, body);
    row.replaceWith(details);

    // Collect FAQ data while processing
    faqData.push({
      questionName: summary.textContent.trim(),
      acceptedAnswer: {
        text: body.textContent.trim(),
      },
    });
  });

  // Add FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.questionName,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.acceptedAnswer.text,
      },
    })),
  };

  // Check if FAQ schema already exists
  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (!existingSchema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
  }

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
