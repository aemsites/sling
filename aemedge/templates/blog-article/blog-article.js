import {
  createTag,
  buildFragmentBlocks,
  buildAuthorLink,
} from '../../scripts/utils.js';

import {
  getMetadata, buildBlock,
} from '../../scripts/aem.js';

import { getTag } from '../../scripts/tags.js';

// This depends on authors naming award icons starting with "award-"
export function decorateAwardIcons() {
  document.querySelectorAll('[class^="icon icon-award-"]').forEach((span) => {
    span.classList.add('award');
  });
}

/**
 * Function to return the name of the author photo
 * photos must be stored with <firstname>-<lastname>-author.jpeg
 * @param {*} aName - author name from metadata
 * @returns
 */
const getAuthorPhoto = (aName) => {
  const aPhotosLoc = `${window.location.origin}/whatson/authors/photos`;
  if (aName !== 'Sling Staff') {
    return `${aPhotosLoc}/${aName.trim().toLowerCase().replaceAll(' ', '-')}-author.jpeg`;
  }
  return `${aPhotosLoc}/sling-default-author.jpg`;
};
/**
 * Function to build the div with the links to tagged pages
 * @param {*} tags - list of tags mentioned in the metadata
 * @returns div element with links
 */
async function buildTagsDiv(tags) {
  const tagsDiv = createTag('div', { class: 'tags' });
  tags.map(async (tag, index) => {
    const tagObj = await getTag(tag.trim());
    if (tagObj) {
      const tagLink = createTag('a', { target: '_self', href: `/whatson/${tagObj.name}` });
      tagLink.innerText = tag.toUpperCase();
      if (tags.length > 1) {
        if (index > 0 && index < tags.length) {
          tagsDiv.append(', ');
        }
      }
      tagsDiv.append(tagLink);
    }
  });
  return tagsDiv;
}

/**
 * Function that will build the author block with
 * photo, name (link to the author page) ,tags
 * and social links
 * @returns div element / author block
 */
export async function buildAuthorBlock() {
  const authName = getMetadata('author') || 'Sling Staff';
  const authPhoto = getAuthorPhoto(authName);
  const pubDate = getMetadata('publication-date');
  const tags = getMetadata('article:tag')?.split(',');
  const authImgContainer = createTag('div', { class: 'image-container' });
  const authImgLink = buildAuthorLink(authName);
  const authImg = createTag('img', {
    class: 'author-image',
    alt: authName,
    src: authPhoto,
    height: '60px',
    width: '60px',
  });
  authImgLink.append(authImg);
  authImgContainer.append(authImgLink);
  const authTxtContainer = createTag('div', { class: 'text-container' });
  const authNameDiv = createTag('div', { class: 'auth-name' });
  const authTxtLink = buildAuthorLink(authName);

  authTxtLink.innerText = authName;
  authNameDiv.append(authTxtLink);
  authTxtContainer.append(authNameDiv);
  // publication date
  if (pubDate) {
    const pubDateDiv = createTag('div', { class: 'pub-date' });
    const pDate = new Date(pubDate);
    pDate.setUTCHours(12, 0, 0, 0);
    pubDateDiv.innerText = pDate.toLocaleDateString('en-us', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
    authTxtContainer.append(pubDateDiv);
  }
  // tags links
  if (tags.length > 0) {
    const tagsDiv = await buildTagsDiv(tags);
    if (tagsDiv) authTxtContainer.append(tagsDiv);
  }

  // social links
  const socialContainer = createTag('div', { class: 'social-share' });
  const shareText = createTag('span', { class: 'share-text' });
  shareText.innerText = 'Share this:';
  const socialList = createTag('ul', { class: 'share-list social' });

  ['facebook', 'twitter'].forEach((social) => {
    const socialListItm = createTag('li', { class: 'share-list-item social' });
    const span = createTag('span', { class: `social-${social} social-share-icon ` });
    const link = createTag(
      'span',
      {
        class: `fa fa-${social}`,
        title: `Share this article on ${social}`,
      },
    );
    span.append(link);
    socialListItm.append(span);
    socialList.append(socialListItm);
  });
  const fashareLink = socialList.querySelector('span.fa-facebook');
  const twitterShareLink = socialList.querySelector('span.fa-twitter');
  const blogUrl = window.location.href;
  const top = window.screen.height / 2 - 260;
  const left = window.screen.width / 2 - 175;
  fashareLink.addEventListener('click', (event) => {
    const faImg = document.querySelector('head > meta[property = "og:image"]')?.content;
    window.open(`https://www.facebook.com/sharer.php?s=100&p[summary]=${event}&p[url]=${blogUrl}&p[images][0]=${faImg}`, 'sharer', `top=${top},left=${left},toolbar=0,status=0,width=520,height=350`);
  });
  twitterShareLink.addEventListener('click', (event) => {
    const twitterImg = document.querySelector('head > meta[property = "twitter:image"]')?.content;
    window.open(`https://twitter.com/intent/tweet?url=${blogUrl}&p[summary]=${event}&p[images][0]=${twitterImg}`, 'sharer', `top=${top},left=${left},toolbar=0,status=0,width=520,height=350`);
  });
  socialContainer.append(shareText, socialList);
  authTxtContainer.append(socialContainer);
  const section = document.createElement('div');
  section.append(buildBlock('author-card', { elems: [authImgContainer, authTxtContainer] }));
  return section;
}

/**
 * The default export that will be invoked when this remplate
 * loaded from scripts.js. search for loadTemplate(main) in scripts.js
 * @param {*} main - main element
 */
export default async function buildBlogDetails(main) {
  // get the section followed by hero section
  const contentSection = main.querySelector(':scope > .section.blog-hero-container+.section') || main.querySelector(':scope > .section');
  // const contentSection = createTag('div');
  // create a wrapper div to place author and content
  const blogContentWrapper = createTag('div', { class: 'blog-details-wrapper' });
  const authWrapper = createTag('div', { class: 'author-details-wrapper' });
  const contentWrapper = createTag('div', { class: 'content-details-wrapper' });

  // move all divs into content wrapper div
  contentSection.querySelectorAll('div[class*="wrapper"]').forEach((div) => {
    contentWrapper.append(div);
  });
  authWrapper.prepend(await buildAuthorBlock());
  // append author and content into parent wrapper
  blogContentWrapper.append(authWrapper, contentWrapper);
  // append the blog details wrapper to the section
  contentSection.append(blogContentWrapper);
  const p = contentWrapper.querySelector('.default-content-wrapper:first-of-type > p:first-of-type');
  if (p) p.remove();
  buildFragmentBlocks(main);
  decorateAwardIcons(main);
}
