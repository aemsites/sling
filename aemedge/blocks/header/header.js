import {
  buildBlock, decorateBlock, getMetadata,
  loadBlock,
} from '../../scripts/aem.js';
import { createTag } from '../../scripts/utils.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll('.nav-sections .default-content-wrapper > ul > li')
    .forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(
    navSections,
    false,
  );
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
  const menuicon = button.querySelector('.nav-hamburger-icon img');
  menuicon.src = expanded ? '/aemedge/icons/menu-open.svg' : '/aemedge/icons/menu-close.svg';
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress or click outside the nav
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function moveTopNav(e, topNavSection, navSections) {
  const topnav = topNavSection.querySelector('.default-content-wrapper');
  if (e.matches) {
    topnav.classList.add('nav-top');
    navSections.append(topnav);
  } else {
    // topnav = navSections.querySelector('.default-content-wrapper.nav-top-links');
    if (!topnav) {
      topNavSection.append(navSections.querySelector('.nav-top'));
      topNavSection.querySelector('.default-content-wrapper').classList.remove('nav-top');
    }

    navSections.querySelector('.nav-top')?.remove();
  }
}
/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/aemedge/nav';
  const fragment = await loadFragment(navPath);
  let topnavSection;
  if (fragment.childElementCount === 4) {
    topnavSection = fragment.firstElementChild;
    topnavSection.classList.add('nav-top');
    topnavSection.setAttribute('aria-labelledby', 'secondary navigation');
  }
  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  if (nav.children.length === 4) {
    classes.unshift('top');
  }
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) {
      section.classList.add(`nav-${c}`);
    }
  });

  // nav brand
  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('a');
  if (brandLink) {
    const brandLogo = document.createElement('img');
    brandLogo.src = '/icons/sling-blue-logo.svg';
    brandLogo.alt = 'Sling TV Logo';
    brandLogo.classList.add('nav-brand-logo');
    brandLink.innerHTML = '';
    brandLink.append(brandLogo);
    if ((brandLink.parentElement.tagName === 'P') && brandLink.parentElement.classList.contains('button-container')) {
      brandLink.parentElement.classList.remove('button-container');
      brandLink.classList.remove('button');
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((navSection) => {
        const children = navSection.querySelector('ul');
        if (children) {
          navSection.classList.add('nav-drop');
          const navDropIcon = document.createElement('span');
          navDropIcon.className = 'nav-drop-icon';
          navSection.insertBefore(navDropIcon, children);
          navDropIcon.addEventListener('click', () => {
            const dropExpanded = navSection.getAttribute('aria-expanded') === 'true';
            navSection.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
          });
        }
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon">
      <img src ="/aemedge/icons/menu-open.svg" /></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections, null));
  nav.append(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  if (topnavSection && navSections) {
    navWrapper.append(topnavSection);
    // code to set up carousel for mobile
    const mquery = window.matchMedia('(max-width: 1024px)');
    mquery.addEventListener(
      'change',
      (event) => moveTopNav(event, topnavSection, navSections),
    );
    moveTopNav(mquery, topnavSection, navSections);
  }
  const wrapper = createTag('div');
  const zipblock = buildBlock('zipcode', createTag('div'));
  wrapper.append(zipblock);
  decorateBlock(zipblock);
  await loadBlock(zipblock);
  nav.insertBefore(wrapper, navSections);
  block.append(navWrapper);
}
