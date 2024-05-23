import { createTag } from '../../scripts/scripts.js';
import {
  buildBlock,
  getMetadata,
} from '../../scripts/aem.js';

const getAuthorPhoto = (aName) => {
  const aPhotosLoc = `${window.location.origin}/whatson/authors/photos`;
  if (aName !== 'Sling Staff') {
    return `${aPhotosLoc}/${aName.trim().toLowerCase().replace(' ', '-')}-author.jpeg`;
  }
  return `${aPhotosLoc}/sling-default-author.jpg`;
};
const buildAuthorBlock = (main) => {
  const authName = getMetadata('author') || 'Sling Staff';
  const authPhoto = getAuthorPhoto(authName);
  const pubDate = getMetadata('publication-date');
  const tags = getMetadata('article:tag')?.split(',');

  const authImgContainer = createTag('div', { class: 'image-container' });
  const authImgLink = createTag('a', {
    href: `${window.location.origin}/whatson/${authName.trim().toLowerCase().replace(' ', '-')}`,
  });
  const authImg = createTag('img', {
    class: 'author-image',
    alt: authName,
    src: authPhoto,
  });
  authImgLink.append(authImg);
  authImgContainer.append(authImgLink);
  const authTxtContainer = createTag('div', { class: 'text-container' });
  const authNameDiv = createTag('div', { class: 'auth-name' });
  const authTxtLink = createTag('a', {
    href: `${window.location.origin}/whatson/${authName.trim().toLowerCase().replace(' ', '-')}`,
  });
  authTxtLink.innerText = authName;
  const pubDateDiv = createTag('div', { class: 'pub-date' });
  pubDateDiv.innerText = new Date(pubDate).toLocaleDateString('en-us', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const tagsDiv = createTag('div', { class: 'tags' });
  tags.map((tag, index) => {
    const tagLink = createTag('a', { href: `/whatson/${tag}` });
    if (index > 0) tagLink.innerText = `,${tag}`;
    else tagLink.innerText = tag;
    return tagsDiv.append(tagLink);
  });

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

  authTxtContainer.append(authNameDiv, pubDateDiv, tagsDiv);
  socialContainer.append(shareText, socialList);
  authTxtContainer.append(socialContainer);
  const section = document.createElement('div');
  section.append(buildBlock('author-card', { elems: [authImgContainer, authTxtContainer] }));
  main.prepend(section);
};
export default function buildBlogDetails(main) {
  buildAuthorBlock(main);
}
