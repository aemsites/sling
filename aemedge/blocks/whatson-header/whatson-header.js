import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { createTag, fetchData } from '../../scripts/utils.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1400px)');

function debounce(callback, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

function createObserver() {
  const header = document.querySelector('.nav-wrapper');
  const nav = document.querySelector('.social-menu-container');
  const options = {
    root: null,
    rootMargin: '',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }, options);

  if (nav) {
    observer.observe(nav);
  }
}

function handleMediaQueryChange() {
  const mediaQuery = window.matchMedia('(max-width: 1400px)').matches;
  const navSocial = document.getElementById('nav-social');
  const navSections = document.querySelector('.nav-sections');
  const navWrapper = document.querySelector('.nav-wrapper');
  const block = document.querySelector('.block');
  if (mediaQuery) {
    navSections.append(navSocial);
  } else {
    block.insertBefore(navSocial, navWrapper);
    navSocial.querySelector('.social-menu-container .list-items-social .list-items-social-label').innerHTML = 'Connect with sling:';
  }
}

async function searchOnType(e) {
  const searchInput = e.target;
  const searchValue = searchInput.value;
  if (searchValue.length >= 3) {
    if (!window.allBlogs) {
      window.allBlogs = await fetchData('/whatson/query-index.json');
    }
    const searchResults = await window.allBlogs.filter((row) => {
      if (row.category !== 'true') {
        if (row.title.toLowerCase().includes(searchValue.toLowerCase())) return true;
        // bad results if searching description so commenting it out for now
        // if (row.description.toLowerCase().includes(searchValue.toLowerCase())) return true;
        const tags = JSON.parse(row.tags).map((tag) => tag.trim().toLowerCase());
        return tags.includes(searchValue.toLowerCase());
      }
      return false;
    });
    const searchResultsDiv = document.querySelector('nav .nav-search .search-results');
    if (searchResultsDiv) {
      searchResultsDiv.innerHTML = '';
      searchResults.forEach(async (row) => {
        const result = createTag('a', { href: row.path, title: row.title, class: 'search-result' }, row.title);
        searchResultsDiv.append(result);
      });
      searchResultsDiv.focus();
    }
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    const searchDiv = nav.querySelector('.nav-search.visible');
    const navSearch = nav.querySelector('.nav-tools span.icon-search');
    if (searchDiv) searchDiv.classList.remove('visible');
    if (navSearch) navSearch.classList.remove('active');
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
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
      //  drop.setAttribute('role', 'button');
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

  // change the social icons label
  const label = nav.querySelector('.list-items-social-label');
  if (label) label.innerText = 'SOCIAL';
  // enable menu collapse on escape keypress or click outside the nav
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const nav = document.createElement('nav');
  const navsocial = document.createElement('nav-social');
  nav.id = 'nav';
  navsocial.id = 'nav-social';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // nav brand
  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('a');
  if (brandLink) {
    const brandLogo = document.createElement('img');
    brandLogo.src = '/aemedge/icons/whats-on.png';
    brandLogo.alt = 'What\'s On Sling';
    brandLogo.classList.add('nav-brand-logo');
    brandLogo.setAttribute('height', '40px');
    brandLogo.setAttribute('width', '119px');
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
          navSection.addEventListener('click', () => {
            const dropExpanded = navSection.getAttribute('aria-expanded') === 'true';
            navSection.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
          });

          // Prevent click events on submenu items from propagating to the parent li
          children.addEventListener('click', (event) => {
            event.stopPropagation();
          });
        }
      });
  }
  // secondary social nav
  const socialhtml = `
   <div class="list-items-social">
       <span class="list-items-social-label">Connect with Sling:</span>
       <ul class="list-inline">
           <li class="social-list-item">
               <a class="social-icon" href="https://www.facebook.com/sling/" target="_blank" aria-label="social media links">
                   <span class="fa fa-facebook-official"></span>
                   <span class="hidden-on-load">Social Media Links</span>
               </a>
           </li>
           <li class="social-list-item">
               <a class="social-icon" href="https://twitter.com/sling" target="_blank" aria-label="social media links">
                   <span class="fa fa-twitter"></span>
                   <span class="hidden-on-load">Social Media Links</span>
               </a>
           </li>
           <li class="social-list-item">
               <a class="social-icon" href="http://instagram.com/sling" target="_blank" aria-label="social media links">
                   <span class="fa fa-instagram"></span>
                   <span class="hidden-on-load">Social Media Links</span>
               </a>
           </li>
       </ul>
   </div>`;
  const socialNav = createTag('div', { class: 'social-menu-container' });
  socialNav.innerHTML = socialhtml;

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections, null));
  nav.append(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navsocial.append(socialNav);
  navWrapper.append(navsocial);
  navWrapper.append(nav);
  block.append(navsocial);
  block.append(navWrapper);
  const label = nav.querySelector('.list-items-social-label');
  if (label) label.innerText = 'Connect with Sling:';
  // Search
  const navSearch = nav.querySelector('.nav-tools span.icon-search');
  if (navSearch) {
    // add input element to nav search and hide it by default
    const searchDiv = createTag('div', { class: 'nav-search' });
    const searchInput = createTag('input', {
      class: 'nav-search-input',
      'aria-label': 'Search',
      type: 'search',
      placeholder: 'Search For Channels, Shows, Sports...',
    });
    const searchIcon = createTag('span', { class: 'icon icon-search' });
    const closeIcon = createTag('span', { class: 'icon icon-close-blue' });
    const searchInputContainer = createTag('div', { class: 'search-input-container' });
    const searchResultsContainer = createTag('div', { class: 'search-results-container' });
    const searchResults = createTag('div', { class: 'search-results' });
    const searchPlaceholder = createTag('div', { class: 'search-placeholder' });
    searchPlaceholder.innerHTML = 'Popular Searches';
    searchInputContainer.append(searchIcon);
    searchInputContainer.append(searchInput);
    searchInputContainer.append(closeIcon);
    searchResults.append(searchPlaceholder);
    searchResultsContainer.append(searchResults);
    searchDiv.append(searchInputContainer);
    searchDiv.append(searchResultsContainer);
    nav.append(searchDiv);
    decorateIcons(searchDiv);
    navSearch.addEventListener('click', () => {
      navSearch.classList.toggle('active');
      searchDiv.classList.toggle('visible');
      searchInput.focus();
    });
    closeIcon.addEventListener('click', () => {
      searchDiv.classList.remove('visible');
      navSearch.classList.remove('active');
    });
    searchInput.addEventListener('input', async (e) => debounce(searchOnType(e), 1000));
  }

  document.addEventListener('click', (e) => {
    if (nav.contains(e.target)) return;
    const searchDiv = nav.querySelector('.nav-search');
    if (searchDiv) searchDiv.classList.remove('visible');
    if (navSearch) navSearch.classList.remove('active');
  });
  createObserver();
  handleMediaQueryChange();
  window.addEventListener('load', handleMediaQueryChange);
  window.addEventListener('resize', handleMediaQueryChange);
}
