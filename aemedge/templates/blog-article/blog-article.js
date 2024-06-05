import {
  createTag,
  buildFragmentBlocks,
  buildVideoBlocks,
} from '../../scripts/utils.js';

import {
  getMetadata, buildBlock,
} from '../../scripts/aem.js';

import { getTag } from '../../scripts/tags.js';

/**
 * Function to return the name of the author photo
 * photos must be stored with <firstname>-<lastname>-author.jpeg
 * @param {*} aName - author name from metadata
 * @returns
 */
const getAuthorPhoto = (aName) => {
  const aPhotosLoc = `${window.location.origin}/whatson/authors/photos`;
  if (aName !== 'Sling Staff') {
    return `${aPhotosLoc}/${aName.trim().toLowerCase().replace(' ', '-')}-author.jpeg`;
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
      if (index > 0) tagLink.innerText = `,${tag}`;
      else tagLink.innerText = tag;
      tagsDiv.append(tagLink);
    }
  });
  return tagsDiv;
}
/**
 * utility to create a tag with link to author page
 * @param {*} authName - author name mentioned in the page metadata
 * @returns a element
 */
const buildAuthorLink = (authName) => {
  const authLink = createTag('a', {
    href: `${window.location.origin}/whatson/${authName.trim().toLowerCase().replace(' ', '-')}`,
  });
  return authLink;
};

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
    pubDateDiv.innerText = new Date(pubDate).toLocaleDateString('en-us', {
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
      'a',
      {
        class: `fa fa-${social}`,
        title: `Share this article on ${social}`,
        'aria-label': `Share this article on ${social}`,
      },
    );
    span.append(link);
    socialListItm.append(span);
    socialList.append(socialListItm);
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
  const contentSection = main.querySelector(':scope > .section.hero-container+.section');
  // const contentSection = createTag('div');
  // create a wrapper div to place author and content
  const blogContentWrapper = createTag('div', { class: 'blog-details-wrapper' });
  const authWrapper = createTag('div', { class: 'author-details-wrapper' });
  const contentWrapper = createTag('div', { class: 'content-details-wrapper' });
  // move all divs into content wrapper div
  contentSection.querySelectorAll('div').forEach((div) => contentWrapper.append(div));
  authWrapper.prepend(await buildAuthorBlock());
  // append author and content into parent wrapper
  blogContentWrapper.append(authWrapper, contentWrapper);
  // append the blog details wrapper to the section
  contentSection.append(blogContentWrapper);
  buildFragmentBlocks(main);
  buildVideoBlocks(main);
}
