import { createTag } from '../../scripts/scripts.js';
import {
  buildBlock,
  getMetadata,
} from '../../scripts/aem.js';
import { getTagsCategory } from '../../scripts/tags.js';

// const findPageByTag = async (tag) => await getTagsCategory(tag);
const getAuthorPhoto = (aName) => {
  const aPhotosLoc = `${window.location.origin}/whatson/authors/photos`;
  if (aName !== 'Sling Staff') {
    return `${aPhotosLoc}/${aName.trim().toLowerCase().replace(' ', '-')}-author.jpeg`;
  }
  return `${aPhotosLoc}/sling-default-author.jpg`;
};
async function buildTagsDiv(tags) {
  const tagsDiv = createTag('div', { class: 'tags' });
  tags.map(async (tag, index) => {
    const tagObj = await getTagsCategory(tag.trim());
    if (tagObj) {
      const tagLink = createTag('a', { target: '_self', href: `/whatson/${tagObj.name}` });
      if (index > 0) tagLink.innerText = `,${tag}`;
      else tagLink.innerText = tag;
      tagsDiv.append(tagLink);
    }
  });
  return tagsDiv;
}
const buildAuthorLink = (authName) => {
  const authLink = createTag('a', {
    href: `${window.location.origin}/whatson/${authName.trim().toLowerCase().replace(' ', '-')}`,
  });
  return authLink;
};
const buildAuthorBlock = async () => {
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
        class: `fafa-${social}`,
        title: `Share this article on ${social}`,
        'aria-label': `Share this article on ${social}`,
      },
    );
    link.innerText = social;
    span.append(link);
    socialListItm.append(span);
    socialList.append(socialListItm);
  });

  socialContainer.append(shareText, socialList);
  authTxtContainer.append(socialContainer);
  const section = document.createElement('div');
  section.append(buildBlock('author-card', { elems: [authImgContainer, authTxtContainer] }));
  return section;
};
export default async function buildBlogDetails(main) {
  // get the section followed by hero section
  const contentSection = main.querySelector('.section.hero-container+.section');
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
  // const breadCrumb = buildBlogBreadcrumb();
  // console.log(breadCrumb);
}
