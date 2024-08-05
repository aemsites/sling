import { getMetadata } from '../../scripts/aem.js';
import { createTag } from '../../scripts/utils.js';
import { loadFragment } from '../fragment/fragment.js';

const decorateLinkItems = (footer) => {
  // add wrapper cs class to all ul elements
  footer.querySelectorAll('ul').forEach((ul) => {
    ul.classList.add('nav-items-wrapper');
  });
  // add css classes for li items, a tags
  footer.querySelectorAll('li').forEach((li) => {
    li.classList.add('nav-item');
    li.querySelectorAll('a').forEach((a) => {
      a.classList.add('nav-link');
      a.setAttribute('target', '_blank');
      a.setAttribute('aria-label', `Visit us on ${a.href}`);
      if (!a.querySelector('span.icon')) {
        const lnkTxt = createTag('span', { class: 'nav-link-text' });
        lnkTxt.innerText = a.innerText;
        a.innerHTML = lnkTxt.outerHTML;
      }
    });
  });
};
/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);
  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  // break into primary and secondary footer sections
  ['primary', 'secondary'].forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-${c}`);
  });
  // in the primary move the social links to into its div

  const primarylinks = createTag('ul', { class: 'footer-primary-links' });
  const socialLinks = createTag('ul', { class: 'footer-social-links' });
  const uls = footer.querySelectorAll('.footer-primary ul');
  uls.forEach((ul, c) => {
    if (c === uls.length - 1) {
      ul.classList.add('social-links-wrapper');
      socialLinks.append(ul);
    } else {
      primarylinks.append(ul);
      ul.firstElementChild.classList.add('nav-heading');
    }
  });
  // organize the social links
  const socialIcons = createTag('ul', { class: 'social-icons-wrapper' });
  socialLinks.querySelectorAll('li').forEach((li) => {
    if (li.querySelector('span.icon')) {
      socialIcons.append(li);
      li.classList.add('social-icon');
    } else {
      li.classList.add('social-link');
    }
  });
  socialLinks.prepend(socialIcons);
  footer.querySelector('.section.footer-primary .default-content-wrapper').replaceWith(primarylinks, socialLinks);

  // add classes for secondary footer nav items
  const secSection = footer.querySelector('.section.footer-secondary');

  if (secSection) {
    const copyright = createTag('div', { class: 'copy-right' });
    const secFooterLinks = createTag('div', { class: 'sec-footer-links' });
    secSection.querySelectorAll('ul > li').forEach((li, idx) => {
      if (idx === 0) {
        li.classList.add('copyright-item');
        const crTxt = createTag('span', { class: 'copy-right-text' });
        crTxt.innerText = li.innerText;
        li.innerHTML = crTxt.outerHTML;

        copyright.append(li);
      } else {
        secFooterLinks.append(li);
      }
    });

    secSection.querySelector('.default-content-wrapper').replaceWith(copyright, secFooterLinks);
  }
  decorateLinkItems(footer);
  block.append(footer);
}
