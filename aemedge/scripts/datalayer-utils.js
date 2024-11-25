import {
  fetchPlaceholders,
} from './aem.js';

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
    // event: params.event || undefined,
    _maruti: {
      pageInfo: {
        language: params.selectedLanguage || undefined,
        city: params.cityName || undefined,
      },
      userInfo: {
        authenticatedState: params.authenticatedState || undefined,
      },
      identities: {
        ecid: params.ecid || undefined,
        hashedphoneSHA256: params.hashedphoneSHA256 || undefined,
      },
      carInfo: {
        model: params.model || undefined,
        color: params.color || undefined,
        carType: params.carType || undefined,
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
  const { corporatepage, cardetailpage, arenacarmodels } = await fetchPlaceholders();
  // TODO : Fix me
  const ecid = getCookieValue('IMS ORG');
  const { hostname: server, pathname: currentPagePath, href: url } = document.location;
  const pageName = document.title;
  const zipcode = getLocalStorage('user-zip') || '';
  const selectedLanguage = currentPagePath.includes('en') ? 'en' : null;
  // const event = 'web.webPageDetails.pageViews';
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

  if (url.includes(corporatepage)) {
    const data = {
      // event,
      authenticatedState,
      ecid,
      url,
      pageName,
      server,
      siteSection,
      isErrorPage,
    };
    window.adobeDataLayer.push(createPageLoadDataLayerObject(data));
  } else if (url.includes(cardetailpage)) {
    const arenaCars = arenacarmodels.split(',');
    let model = '';
    arenaCars.forEach((car) => {
      if (url.toLowerCase().includes(car.toLowerCase())) {
        model = car.toLowerCase();
      }
    });
    const data = {
      // event,
      zipcode,
      selectedLanguage,
      authenticatedState,
      url,
      pageName,
      server,
      siteSection,
      isErrorPage,
      model,
    };
    window.adobeDataLayer.push(createPageLoadDataLayerObject(data));
  } else {
    const data = {
      // event,
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
}
