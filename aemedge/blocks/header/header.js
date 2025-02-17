import { loadFragment } from '../fragment/fragment.js';
import { createTag } from '../../scripts/utils.js';
import {
  buildBlock, decorateBlock, getMetadata,
  loadBlock,
} from '../../scripts/aem.js';
// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1380px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
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

function closeOnFocusLost(e) {
  if (!e.relatedTarget || e.relatedTarget === document.body) return;
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
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
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
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
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  const navmenu = document.createElement('div');
  navmenu.classList.add('navmenu');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  const backbutton = document.createElement('div');
  backbutton.classList.add('backbutton');
  backbutton.innerHTML = 'Back';
  nav.append(backbutton);
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      const navheading = Array.from(navSection.childNodes)
        .find((node) => node.nodeType === Node.TEXT_NODE);
      if (navheading) {
        const aTag = document.createElement('a');
        aTag.classList.add('nav-heading');
        aTag.href = '#'; // Set your desired URL here
        aTag.textContent = navheading.textContent;
        navSection.replaceChild(aTag, navheading);
      }
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', (event) => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          const navs = navSections.querySelectorAll(':scope .default-content-wrapper > ul > li');
          const navsecondary = nav.querySelector('.navsecondary');
          const isExpanded = Array.from(navs).some((section) => section.getAttribute('aria-expanded') === 'true');
          if (isExpanded) {
            navsecondary.classList.add('show');
            navmenu.classList.add('show');
          } else {
            navsecondary.classList.remove('show');
            navmenu.classList.remove('show');
          }
        } else {
          const navprimary = nav.querySelectorAll('.navprimary .nav-drop .nav-heading');
          const navsecondary = nav.querySelector('.navsecondary');
          navprimary.forEach((item) => { item.classList.add('hide'); });
          navsecondary.classList.add('hide');
          backbutton.classList.toggle('show');
          event.target.nextElementSibling.classList.add('show');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => {
    const navprimary = nav.querySelectorAll('.navprimary .nav-drop .nav-heading');
    const navsecondary = nav.querySelector('.navsecondary');
    backbutton.classList.remove('show');
    if (navsecondary) {
      navsecondary.classList.remove('hide');
    }
    const uls = nav.querySelectorAll('.navprimary .nav-drop ul');
    navprimary.forEach((item) => { item.classList.remove('hide'); });
    uls.forEach((item) => { item.classList.remove('show'); });
    toggleMenu(nav, navSections);
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  navWrapper.append(navmenu);
  const wrapper = createTag('div');
  const zipblock = buildBlock('zipcode', createTag('div'));
  wrapper.append(zipblock);
  decorateBlock(zipblock);
  await loadBlock(zipblock);
  nav.insertBefore(wrapper, navSections);
  block.append(navWrapper);

  backbutton.addEventListener('click', () => {
    const navprimary = nav.querySelectorAll('.navprimary .nav-drop .nav-heading');
    const navsecondary = nav.querySelector('.navsecondary');
    backbutton.classList.remove('show');
    if (navsecondary) {
      navsecondary.classList.remove('hide');
    }
    const uls = nav.querySelectorAll('.navprimary .nav-drop ul');
    navprimary.forEach((item) => { item.classList.remove('hide'); });
    uls.forEach((item) => { item.classList.remove('show'); });
  });
}
