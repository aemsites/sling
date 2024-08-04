import { getMetadata } from '../../scripts/aem.js';
import { createTag } from '../../scripts/utils.js';

export default async function decorate(main) {
  const bcWrapper = createTag('div', { class: 'blog-breadcrumb' });
  const defaultContent = document.querySelector('main > div');
  const authName = getMetadata('author');
  if (main) {
    const embedHTML = `<a class="blog-breadcrumb-link" href="/whatson">BLOG</a>
<span class="icon icon-fw-arrow"></span><span class="blog-breadcrumb-active-article">${authName}</span>`;
    bcWrapper.innerHTML = embedHTML;
    defaultContent.append(bcWrapper);
  }
}
