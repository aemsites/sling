function getCookieValue(cookieName) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookiesArray = decodedCookie.split(';');

  for (let i = 0; i < cookiesArray.length; i += 1) {
    const cookie = cookiesArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length).replace('MCMID|', '');
    }
  }
  return null;
}

function getLocalStorage(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function removeEmpty(obj) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      removeEmpty(obj[key]);
    }
    if (obj[key] === undefined || (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)) {
      delete obj[key];
    }
  });
}

function createPageLoadDataLayerObject(params) {
  const result = {
    event: params.event || undefined,
    sling: {
      pageInfo: {
        language: params.selectedLanguage || undefined,
        zipcode: params.zipcode || undefined,
      },
      userInfo: {
        authenticatedState: params.authenticatedState || undefined,
        ecid: params.ecid || undefined,
      },
    },
    web: {
      webPageDetails: {
        URL: params.url || undefined,
        name: params.pageName || undefined,
        server: params.server || undefined,
        siteSection: params.siteSection || undefined,
        isErrorPage: params.isErrorPage || false,
      },
    },
  };

  removeEmpty(result);
  return result;
}

// eslint-disable-next-line import/prefer-default-export
export async function setDataLayer() {
  const ecid = getCookieValue('AMCV_9425401053CD40810A490D4C@AdobeOrg');
  const { hostname: server, pathname: currentPagePath, href: url } = document.location;
  const pageName = document.title;
  const zipcode = getLocalStorage('user-zip') || '';
  const selectedLanguage = currentPagePath.includes('en') ? 'en' : null;
  const event = 'web.webPageDetails.pageViews';
  const authenticatedState = 'unauthenticated';
  const isErrorPage = false;
  let siteSection = '';
  if (url.includes('whatson')) {
    siteSection = 'Blogs';
  } else if (url.includes('help')) {
    siteSection = 'Help';
  } else {
    siteSection = 'Landing Page';
  }

  const data = {
    event,
    zipcode,
    selectedLanguage,
    authenticatedState,
    ecid,
    url,
    pageName,
    server,
    siteSection,
    isErrorPage,
  };
  window.adobeDataLayer.push(createPageLoadDataLayerObject(data));
}
