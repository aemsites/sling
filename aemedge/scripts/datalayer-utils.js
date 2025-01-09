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

function hasTouchSupport() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function createPageLoadDataLayerObject(params) {
  const result = {
    event: params.event || undefined,
    screenLoadFired: true,
    sling: {
      pageInfo: {
        language: params.selectedLanguage || undefined,
        zipcode: params.zipcode || undefined,
      },
    },

    web: {
      currentEvent: params.event || undefined,
      platform: hasTouchSupport() ? 'mobile' : 'web',
      _sling: {
        appName: 'aem-marketing-site',
        analyticsVersion: '7.0.38',
      },
      webPageDetails: {
        URL: params.url || undefined,
        name: params.pageName || undefined,
        domain: params.server || undefined,
        siteSection: params.siteSection || undefined,
        type: params.siteSubSection || undefined,
        language: params.language || undefined,
      },
      user: {
        ecid: params.ecid || undefined,
        guid: 'null',
        accountStatus: '',
        authState: params.authenticatedState,
      },
    },
  };

  removeEmpty(result);
  return result;
}

// eslint-disable-next-line import/prefer-default-export
export async function setDataLayer() {
  const ecid = getCookieValue('AMCV_9425401053CD40810A490D4C@AdobeOrg');
  const { hostname: server, href: url } = document.location;
  const pageName = document.title;
  const zipcode = getLocalStorage('user_zip') || '';
  const selectedLanguage = 'en';
  const event = 'screen_load';
  const authenticatedState = 'logged_out';
  const siteSection = 'domestic';
  let siteSubSection = '';
  if (url.includes('/whatson')) {
    siteSubSection = 'blog';
  } else if (url.includes('/help')) {
    siteSubSection = 'help';
  } else if (!url.includes('/')) {
    siteSubSection = 'home';
  } else {
    siteSubSection = 'generic';
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
    siteSubSection,
  };
  window.adobeDataLayer.push(createPageLoadDataLayerObject(data));
}
