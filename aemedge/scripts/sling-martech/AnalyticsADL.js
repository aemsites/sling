
const  eventNames  = JSON.parse(JSON.stringify('./config/eventNames.json'));
const validSteps   = JSON.parse(JSON.stringify('./config/validSteps.json'));
const stepPageTypeOverrides  = JSON.parse(JSON.stringify('./config/stepPageTypeOverrides.json'));
const version = '7.0.39';
const parameterConfig  = JSON.parse(JSON.stringify('./config/queryParameters.json'));



const SIMPLE_TYPES = [
  'text',
  'hidden',
  'radio',
  'number',
  'textarea',
  'radio',
];

function analyticsWarn(msg) {
  // eslint-disable-next-line no-console
  console.warn(`[Analytics Warning] ${msg}`);
}

function analyticsError(msg) {
  // eslint-disable-next-line no-console
  console.error(new Error(`[Analytics Error] ${msg}`));
}

/**
 * TODO Major TODOs (not listed below, though not exhaustive).
 *   - Handle persistent data
 *      - When to load it? Analytics init?
 *      - When to save it? On every call in a DL handler?
 *      - Refs: EventLog.loadPersistentData(), EventLog.savePersistentData().
 *   - Verify if the cookies for user info are needed, see EventLog.writeOldCookies().
 */
export class AnalyticsADL {
  /**
   * THIS SHOULD NEVER BE DIRECTLY CALLED OUTSIDE ANALYTICS-JS!
   *
   * @param {string} appName - The name of the application using analytics-js
   *                           (passed to debug report)
   *
   * @param {any[]} dataLayer - The data layer instance to use.
   *
   * @returns {AnalyticsADL}
   *
   * @example
   * const analytics = new Analytics('the app');
   */
  constructor(appName, dataLayer) {
    this.screenLoadFired = false;
    this.formStartFired = {};
    this.appName = appName;
    this.dataLayer = dataLayer;

    const debugACDL = localStorage.getItem('debugACDL');

    if (debugACDL === 'true') {
      this.dataLayer.addEventListener(
        'adobeDataLayer:change',
        // eslint-disable-next-line prefer-arrow-callback
        function printACDLDebug(dl) {
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(dl, null, '  '));
        }
      );
    }
  }

  /**
   * Update debug info into the data layer. This should only be called once per page load.
   * Calling this multiple times may add records to the data layer, but has no impact on the
   * effective data layer.
   *
   * @example
   * analytics.updateDebugData();
   */
  updateDebugData() {
    const data = {
      web: {
        webPageDetails: {
          platform: 'web', // TODO what should this be?
          _sling: {
            appName: this.appName,
            analyticsVersion: version,
          },
        },
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * @typedef {Object} AnalyticsPageInfo
   * @type {Object}
   * @property {?string} name - the page name.
   *    Defaults to `window.location.pathname`.
   * @property {?string} lineOfBusiness - the line of business for this page.
   * @property {?string} classification - the classification for this page,
   *    Defaults to local storage value 'cart_classification.
   * @property {?string} type - the screen type (TODO check is this should be in page data).
   * @property {?string|?boolean} lang - the language for this page.
   *    Defaults to the "language" part of the html-element's lang attribute.
   * @property {?string} domain - the channel for the page.
   *    Defaults to the page hostname's first segment of the hostname (the part before first ".")
   */

  /**
   * Update page info into the data layer. This should only be called once per page load.
   *
   * @param {AnalyticsPageInfo} pageInfo - the page params
   *
   * @example
   * analytics.updatePageData({
   *   lob: 'domestic',
   *   classification: 'us'
   * });
   */
  updatePageData({
    name = window.location.pathname === '/' ? 'home' : window.location.pathname,
    lineOfBusiness,
    classification,
    type = 'generic',
    // The false here is intentional. Tealium/analytics is expecting that value when no language exists
    // TODO possibly fix this in migration to Launch
    lang = document.documentElement?.lang?.substr(0, 2) ?? false,
    domain = window.location.hostname,
  }) {
    const qsp = window.location.search.slice(1);
    const pageTitle = document.title;

    let pageErrorName;
    let isErrorPage = false;
    if (pageTitle === '404') {
      pageErrorName = pageTitle;
      isErrorPage = true;
    }

    const data = {
      web: {
        webPageDetails: {
          name,
          type,
          qsp,
          language: lang,
          siteSection: lineOfBusiness, // TODO verify this is ok
          siteSubSection: classification, // TODO verify this is ok
          siteSubSubSection: undefined, // TODO what should this be?
          domain,
          pageErrorName,
          isErrorPage
        }
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * @typedef {Object} AnalyticsUserInfo
   * @type {Object}
   * @property {?string} classification - The user's classification
   * @property {?string} guid - The user's guid
   * @property {?string} lineOfBusiness - The user's line of business
   * @property {?string[]} packages - The user's packages
   * @property {?string} plan - The user's plan
   * @property {?string} status - The user's account status (active, expired, lead)
   * @property {?string} uuid - The user's uuid
   * @property {?string} zipCode - The user's zip code
   */

  /**
   * Update user info into the data layer.
   *
   * @param {AnalyticsUserInfo} userInfo - the page params
   *
   * @example
   * TODO
   */
  updateUserData(userData) {
    const {
      guid,
      email,
      emailSha256,
      offerIdentifier,
      packages,
      plan,
      planOffer,
      status,
      subscribedPackages,
      uuid,
      classification,
      lineOfBusiness,
      zipCode,
    } = userData;
    const packagesArray = Array.isArray(packages) ? packages : [packages];
    
    // If email is null or undefined, contactInfo will be an empty object
    const contactInfo = email ? { 
      contact: {
        email,
        hashed: {
          sha256: {
            email: emailSha256
          }
        }
      }
    } : {};

    const data = {
      web: {
        user: {
          guid,
          ...contactInfo,
          ...(status && { accountStatus: status }),
          ...(offerIdentifier && { offerIdentifier }),
          ...(plan && { plan }),
          ...(planOffer && { planOffer }),
          ...(subscribedPackages && { subscribedPackages }),
          zipCode,
          _sling: {
            packageNames: packagesArray,
            uuid, // TODO should this be the subscriberId?
            classification,
            lineOfBusiness,
          },
        },
      },
    };

    this.dataLayer.push(data);
    localStorage.setItem('adobeDataLayer.web.user', JSON.stringify(userData));
  }

  /**
   * Update performance info into the data layer. This should only be called once per page load.
   * Calling this multiple times may add records to the data layer, but has no impact on the
   * effective data layer.
   *
   * NOTE: This must be called after the performance data is recorded (aka page is finished loading).
   * This can be accomplished by putting the call to updatePerformanceData in a setTimeout()
   *
   * @example
   * window.addEventListener('load', () => {
   *   analytics.updatePerformanceData();
   * });
   */
  updatePerformanceData() {
    const millis =
      Math.round(window?.performance?.getEntriesByType?.('navigation')?.[0]?.domComplete ?? 0);
    const seconds = Math.floor(millis / 1000);
    const bucket = seconds > 10 ? '10+sec' : `${seconds}-${seconds + 1}sec`;

    const data = {
      web: {
        webPageDetails: {
          loadTime: millis,
          _sling: {
            loadTimeBucket: bucket,
          },
        },
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Update page access info into the data layer. This should only be called once per page load.
   * Calling this multiple times may add records to the data layer, but has no impact on the
   * effective data layer.
   *
   * @example
   * analytics.updatePageAccessInfo();
   */
  updatePageAccessInfo() {
    const pageViewDayOfWeek = (new Date()).toLocaleString('en-US', {
      timeZone: 'America/Denver', weekday: 'short'
    })
      .toLowerCase();

    const data = {
      web: {
        webPageDetails: {
          _sling: {
            pageViewDayOfWeek,
          },
        },
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Update params info into the data layer. This needs to be called on page load and when  the params
   * change, but the page does not reload.
   * @example
   * analytics.addPageData();
   */
  updateUrlParamsData(urlSearchParams) {
    // TODO should this be part of pageData?
    // TODO does this need to be called when we change params but don't reload?
    // TODO handle reading from local storage

    const urlParamsArray = Array.from(urlSearchParams.entries());

    const fromEntriesToObject = (prev, cur) => {
      // eslint-disable-next-line no-param-reassign
      prev[cur[0]] = cur[1];
      return prev;
    };

    /**
     * @type {Object.<string, Array.<string>>}
     */
    const simpleParamConfig = parameterConfig;

    const isSimpleParam = paramName => Object.entries(simpleParamConfig)
      // true if it is in one of the groups in the config
      .filter(([, groupMembers]) => groupMembers.includes(paramName))
      // reduce down to a single true/false value
      .reduce((cur, next) => cur || next, false);

    const simpleParams = urlParamsArray.filter(([paramName]) => isSimpleParam(paramName))
      .reduce(fromEntriesToObject, {});

    // This is very special handling to convert roku_code into easy_code + easy_device
    const rokuCodeParams = {};
    const rokuCodeValue = urlSearchParams.get('roku_code');

    if (rokuCodeValue) {
      rokuCodeParams.easy_code = rokuCodeValue;
      rokuCodeParams.easy_device = 'roku';
    }
    // end special handling for roku

    const data = {
      web: {
        webPageDetails: {
          _sling: {
            urlParams: {
              ...simpleParams,
              ...rokuCodeParams,
            },
          },
        },
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Update the locals zip code for the locals component.
   *
   * @param {number} localsComponentZip - the zip code.
   *
   * @example
   * analytics.updateLocalsZipCode(12345);
   */
  updateLocalsZipCode(localsComponentZip) {
    if (!localsComponentZip) {
      analyticsWarn('Zip code was not provided');
      return;
    }

    const data = {
      web: {
        user: {
          zipCode: localsComponentZip,
        },
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when the page loads.
   *
   * **NOTE:** Using this with page params or a zip code is deprecated.
   *
   * @param {*} o
   * @param {?number} o.localsComponentZip - Deprecated: the locals zip.
   *    Use `analytics.updateLocalsZipCode()` instead.
   * @param {?AnalyticsPageInfo} o.pageData - Deprecated: the page data.
   *    Use `analytics.updatePageData()` instead.
   * @example
   * analytics.screenLoad('account', 'latino', 'latino', 'home', 'es');
   */
  screenLoad({ localsComponentZip, ...pageData }) {
    if (this.screenLoadFired) {
      analyticsWarn('screenLoad was called twice, not calling again.');
      return;
    }
    this.screenLoadFired = true;

    // TODO ensure this waits until page load time data is set
    //  This may not be a problem, just noting here to verify
    this.updatePageData(pageData);
    this.updateLocalsZipCode(localsComponentZip);

    const data = {
      event: eventNames.screenLoad,
      screenLoadFired: true,
      web: {
        currentEvent: eventNames.screenLoad,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Get the value of the form field element. Value will be the type-dependent value. If there are
   * multiple values, value will be a comma-separated list of the values. If the type is a checkbox,
   * the value will be 'checked' or 'unchecked'. If the form element isn't marked with
   * 'data-sling-analytics-capture', its value will be the constant 'untracked'.
   *
   * The value will only be collected
   *
   * @param {?FormField} field - a form field
   *
   * @returns {string}
   */
  static getFormFieldValue(field) {
    /** @type {(HTMLInputElement |HTMLTextAreaElement | HTMLSelectElement)} */
    const el = field instanceof RadioNodeList ? field[0] : field;
    const dataset = el?.dataset ?? {};
    let value = 'untracked';

    if ('slingAnalyticsCapture' in dataset) {
      if (el instanceof HTMLSelectElement) {
        value = Array.from(el.selectedOptions)
          .map(op => op.value)
          .join(',');
      } else if (el.type === 'checkbox') {
        value = el.checked ? 'checked' : 'unchecked';
      } else if (SIMPLE_TYPES.includes(el.type)) {
        value = el.value;
      } else {
        analyticsWarn(`Unsupported field type. form: ${el?.form?.name ?? el?.form?.id ?? 'id missing'}
          , field: ${el?.name}, type: ${el?.type}`);
        value = 'unsupported field type';
      }
    }

    return value;
  }

  /**
   * @typedef {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | RadioNodeList} FormField
   */

  /**
   * @typedef UpdateFormDataParams
   * @type {Object}
   * @property {?HTMLFormElement} form
   * @property {?FormField} field
   * @property {?string} fieldName
   * @property {?string} name - Identifier for the form
   * @property {?string} error - Error Key (or human readable description)
   */

  /**
   * Updates the form data for this form. If the field is not marked with the attribute
   * `data-sling-analytics-capture`, the value will always show as 'untracked`
   *
   * @param {UpdateFormDataParams} params
   */
  updateFormData({
    form,
    field,
    fieldName,
    name,
    error,
  }) {
    const normalizedField = form?.elements?.[fieldName]
      ?? form?.elements?.[field?.name]
      ?? field?.form?.elements?.[field?.name]
      ?? field;

    let formField;

    if (normalizedField || fieldName) {
      const normalizedFieldName = fieldName || normalizedField.name || normalizedField.id;
      const normalizedFieldValue = AnalyticsADL.getFormFieldValue(field);

      if (normalizedFieldName) {
        formField = {
          name: normalizedFieldName,
          value: normalizedFieldValue,
        };
      } else {
        analyticsWarn(`Not tracking field with value because there is no field name or ID`);
      }
    }

    // intentional use of || because name and id will be empty strings, not null/undefined
    const formName = name ?? (form.name || form.id || 'form name not found');

    const data = {
      form: {
        formDetails: {
          formName,
          _sling: {
            formField,
          },
          errorDetails: error,
        },
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when the user completes a form
   *
   * @param {*} o - the params
   * @param {HTMLFormElement} o.element - Da form
   * @param {?string} o.name - Identifier for the form
   *
   * To capture input values, a data tag must be set on the input element
   * data-sling-analytics-capture=true
   * Be certain that you should capture the inputs before you add the tag
   *
   * @example
   * analytics.formComplete({element: document.getElementById('some-form')});
   * analytics.formComplete({name: 'some-form'});
   */
  formComplete({ element, name }) {
    this.updateFormData({
      form: element,
      name,
    });

    const data = {
      event: eventNames.form.complete,
      web: {
        currentEvent: eventNames.form.complete,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when an error occurs on any form (user error or API/technical error)
   *
   * @param {*} o
   * @param {HTMLFormElement} o.element - Da form
   * @param {?string} o.name - Identifier for the form
   * @param {string} o.error - Error Key (or human readable description)
   *
   * @example
   * analytics.formError({element: document.getElementById('some-form'), error: 'PEBCAK'});
   * analytics.formError({name: 'some-form', error: 'ID-Ten-Tee'});
   */
  formError({ element, name, error }) {
    this.updateFormData({
      form: element,
      name,
      error
    });

    const data = {
      event: eventNames.form.error,
      web: {
        currentEvent: eventNames.form.error,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when the user interacts w/ a form element (usually on `blur`)
   *
   * @param {*} form
   * @param {HTMLFormElement} form.element - Da form
   * @param {string} form.name -  Identifier for the form
   * @param {*} input
   * @param {HTMLFormElement} input.inputElement - The input
   * @param {string} input.inputName - The input name
   *
   * To capture input values, a data tag must be set on the input element
   * data-sling-analytics-capture=true
   * Be certain that you should capture the inputs before you add the tag
   *
   * @example
   * analytics.formInteraction(
   *   {element: document.getElementById('some-form')},
   *   {inputElement: document.getElementById('a-textarea-or-something')}
   * );
   * analytics.formInteraction(
   *   {name: 'some-form'},
   *   {inputName: 'a-textarea-or-something'}
   * );
   * analytics.formInteraction(
   *   {element: document.getElementById('mix-and-match')},
   *   {inputName: 'a-checkbox-maybe'}
   * );
   */
  formInteraction(
    { element, name },
    { inputElement, inputName },
  ) {
    // Call formStart(), which checks if already fired for this form.
    this.formStart({ element, name });

    this.updateFormData({
      form: element,
      field: inputElement,
      fieldName: inputName,
      name,
    });

    const data = {
      event: eventNames.form.interaction,
      web: {
        currentEvent: eventNames.form.interaction,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when the user first interacts w/ a specific form
   * (first time an element is `focus`ed, usually)
   *
   * @param {*} form
   * @param {HTMLFormElement} form.element - Da form
   * @param {string} form.name -  Identifier for the form
   *
   * @example
   * analytics.formStart({element: document.getElementById('some-form')});
   * analytics.formStart({name: 'some-form'});
   */
  formStart({ element, name }) {
    const formId = name || element?.name || element?.id;

    if (!formId) {
      analyticsWarn('The form id was not found.');
      return;
    }

    if (this.formStartFired[formId]) {
      // Already called form start for this form
      return;
    }

    this.formStartFired[formId] = true;

    this.updateFormData({
      form: element,
      name,
    });

    const data = {
      event: eventNames.form.start,
      web: {
        currentEvent: eventNames.form.start,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when the user logs into their account
   *
   * @param {AnalyticsUserInfo} userInfo - The user info
   *
   * @example
   * analytics.userLogin({'us', '11131', 'domestic',
   *  ['sling-orange', 'sling-blue'], 'one-week-free', 'active', '1222'});
   */
  userLogin(userInfo) {
    this.updateUserData(userInfo);

    const data = {
      event: eventNames.userLogin,
      web: {
        user: {
          authState: 'logged_in',
        },
        currentEvent: eventNames.userLogin,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when the user signs out of their account
   *
   * @example
   * analytics.userLogout();
   */
  userLogout() {
    const data = {
      event: eventNames.userLogout,
      web: {
        user: {
          authState: 'logged_out',
        },
        currentEvent: eventNames.userLogout,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * @typedef {Object} userCancelTenureInfo
   * @type {Object}
   * @property {?string} refundStatus
   */

  /**
   * Dispatch this event when the user cancels so that we can capture the cancel tenure.
   *
   * @param {userCancelTenureInfo} data
   *
   * @example
   * const data = { refundStatus: 'same_day_refunded' };
   * analytics.userCancelTenure(data);
   */
  userCancelTenure({
    accountStatus,
    refundStatus,
    offerIdentifier,
    plan,
    planOffer,
    subscribedPackages
  }) {
    if (!refundStatus) {
      analyticsWarn('Could not find "refundStatus" argument in userCancelTenure');
      return;
    }
    const data = {
      event: eventNames.cancelTenure,
      web: {
        user: {
          ...(accountStatus && { accountStatus }),
          cancelTenure: refundStatus,
          ...(offerIdentifier && { offerIdentifier }),
          ...(plan && { plan }),
          ...(planOffer && { planOffer }),
          ...(subscribedPackages && { subscribedPackages }),
        }
      }
    };
    this.dataLayer.push(data);
    localStorage.removeItem('adobeDataLayer.web.user');
  }

  /**
   * Dispatch this event when the user creates a new account
   *
   * @param {AnalyticsUserInfo} userInfo - The user info
   *
   * @example
   *  analytics.userRegister('us', '12324241212', 'domestic', ['sling-orange', 'sling-blue'],
   *  'one-stair-step', 'lead', 'free trial', '2343243232')
   */
  userRegister(userInfo) {
    this.updateUserData(userInfo);

    const data = {
      event: eventNames.userRegister,
      web: {
        currentEvent: eventNames.userRegister,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * @typedef {Object} AnalyticsCartInfo
   * @type {Object}
   * @property {string}  category cart step category
   * @property {string}  subCategory cart step sub-category
   * @property {string}  referrer cart step referrer (source page)
   * @property {string}  planName cart step plan name
   * @property {string}  offerName cart step plan offer name
   * @property {string}  deviceBundle device bundle type for cart
   * @property {string}  subType derived from cart type plan, default value is "paid"
   * @property {?string[]}  basePreselect base package from cart
   * @property {?string[]}  extrasPreselect extras package from cart
   */

  /**
   * Update cart data to the data layer.
   *
   * @param {AnalyticsCartInfo} cartData analytics data from cart
   */
  updateCartData({
    category = 'unknown',
    subCategory = 'unknown',
    referrer,
    planName = 'unknown',
    offerName = 'unknown',
    deviceBundle,
    subType = 'unknown',
    basePreselect = [],
    extrasPreselect = [],
  }) {
    const packagePreselect = [...basePreselect, ...extrasPreselect];
    const formattedPackagePreselect = packagePreselect.join('|');

    const data = {
      commerce: {
        cart: {
          _sling: {
            category,
            subCategory,
            referrer,
            planName,
            offerName,
            deviceBundle,
            subType,
            basePreselect,
            extrasPreselect,
            packagePreselect,
            // Normally we would pass in the raw array of data for this, but it was requested that
            //  packagePreselect be the same format as it was in tealium (pipe separated values).
            formattedPackagePreselect,
          },
        },
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Report when a user selects/deselects an item in the cart.
   *
   * @param {string} type event type (e.g. add, remove)
   * @param {AnalyticsProductInfo[]} cartData analytics data from cart
   *
   *  @example
   * analytics.cartSelection('add', cartData)
   */
  cartSelection(
    type,
    cartData
  ) {
    const eventName = eventNames.cartSelection[type];
    if (!eventName) {
      // eslint-disable-next-line no-console
      analyticsWarn('Unknown event name in cart selection');
      return;
    }

    this.updateProductListItems(cartData);

    const data = {
      event: eventName,
      web: {
        currentEvent: eventName,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when a *cart* page loads
   *
   * @param {string} stepName the name of the cart step (e.g. accounts, products, billing, etc)
   * @param {AnalyticsCartInfo} cartData analytics data from cart
   * @param {AnalyticsPageInfo}  pageData analytics data from current page user is on
   *
   *  @example
   * analytics.cartStep('products', cartData, pageData, false)
   */
  cartStep(stepName, cartData, pageData) {
    const cartEventName = eventNames.cartStep[stepName];
    if (!cartEventName) {
      analyticsWarn('Unknown event name in cart step');
      return;
    }

    // TODO remove the need to update pageData
    this.updatePageData(pageData);
    this.updateCartData(cartData);

    const data = {
      event: cartEventName,
      web: {
        currentEvent: cartEventName,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * @typedef {Object} AnalyticsInteractionInfo
   * @type {Object}
   * @property {HTMLElement} element - The source HTML element the user interacted with
   * @property {string} [name=element.textContent.replace(/\s+/g,'-').toLowerCase()] - Kebab-case
   *   text on clicked element
   * @property {string} [component=element.tagName.toLowerCase()] - The type of element being
   *   interacted with
   * @property {string} [parent=element.parentNode.tagName.toLowerCase()] - The parent component of
   *   the target element
   * @property {string} [target=element.getAttribute('href')] - The href value of the clicked element
   */

  /**
   * Dispatch this event when the user interacts w/ a UI element
   *
   * @param {AnalyticsInteractionInfo} props
   *
   * @example
   * analytics.uiInteraction({ element: document.getElementById('homepage-cta') });
   */
  uiInteraction(params) {
    const { element } = params;
    let { name, component, parent, target } = params;

    // Handle empty string defaults grab defaults for the values
    name = name ?? element?.textContent?.replace?.(/\s+/g, '-') ?? '';
    component = component ?? element?.tagName?.toLowerCase?.() ?? '';
    parent = parent ?? element?.parentNode?.tagName.toLowerCase?.() ?? '';
    target = target ?? element?.getAttribute?.('href') ?? '';

    // Check the data values for truthy values, so we can warn when none are truthy.
    // Keep only values that have a truthy value.
    const goodData = [name, component, parent].filter(v => !!v);

    // Warn and skip the call if there were no truthy values.
    if (!goodData.length) {
      analyticsWarn(`UIInteraction: No data was passed in for {name, component, parent} and no element was provided`);
      return;
    }

    const interactionName = `${parent}|${component}|${name}`;

    const data = {
      event: eventNames.uiInteraction,
      web: {
        webInteraction: {
          // clickLocation: undefined, // TODO what should this be?
          name,
          type: 'other', // TODO revisit this later.
          _sling: {
            component,
            parent,
            interactionName,
            target
          },
        },
        currentEvent: eventNames.uiInteraction,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * @typedef {Object} AnalyticsModalInfo
   * @type {Object}
   * @property {?string} name - The source HTML element the user interacted with
   */

  /**
   * Dispatch this event whenever user opens a modal
   *
   * @param {AnalyticsModalInfo} data
   *
   * @example
   * const data = { name: 'cancel_subscription_modal' };
   * analytics.modalOpen(data);
   */
  modalOpen({
    name,
  }) {
    if (!name) {
      analyticsWarn('Could not find "name" argument in modalOpen');
      return;
    }

    const data = {
      event: eventNames.modal.modalOpen,
      web: {
        webInteraction: {
          _sling: {
            modalName: name,
          }
        },
        currentEvent: eventNames.modal.modalOpen,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event whenever user closes a modal
   *
   * @param {AnalyticsModalInfo} data
   *
   * @example
   * const data = { name: 'cancel_subscription_modal' };
   * analytics.modalClose(data);
   */
  modalClose({
    name,
  } = {}) {
    if (!name) {
      analyticsWarn('Could not find "name" argument in modalClose');
      return;
    }

    const data = {
      event: eventNames.modal.modalClose,
      web: {
        webInteraction: {
          _sling: {
            modalName: name,
          }
        },
        currentEvent: eventNames.modal.modalClose,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * @typedef {Object} AnalyticsOrderInfo
   * @type {Object}
   * @property {string} orderId the order id
   * @property {string} subtotal the subtotal of the user's order
   * @property {string} total the total of the user's order
   * @property {string} tax the tax on the subscription order
   * @property {string} currency the currency identifier on the subscription order
   * @property {string} cartName the cart name on the subscription order
   * @property {string} planName the plan name for the subscription order
   * @property {string} offerName the plan offer name for the subscription order
   * @property {string} promoCode the promo code on the subscription order
   * @property {string} giftCard the gift card code for the subscription order
   * @property {string} type order type (options: sub-create, sub-change, sub-restart)
   */

  /**
   * @typedef {Object} AnalyticsProductInfo
   * @type {Object}
   * @property {string} id - product identifier
   * @property {string} name - name of product
   * @property {?string} quantity - quantity of the product
   * @property {string} guid - sku of product
   * @property {string} unitPrice - unit price of the product
   * @property {string} category - category of the product
   */

  /**
   * Update productListItems in the data layer
   * @param {AnalyticsProductInfo[]} products
   */
  updateProductListItems(products) {
    const productListItems = products.map((product) => {
      const {
        id,
        name,
        quantity: rawQuantity,
        unitPrice: rawPrice,
        guid,
        category,
      } = product;

      // XXX Data fix to be removed later XXX
      // intentional use of || instead of ??
      const quantity = (rawQuantity || '1').toString();
      const priceTotal = rawPrice?.toString?.();
      // XXX End data fix

      return {
        name,
        quantity,
        priceTotal,
        _sling: {
          id,
          guid,
          category,
        },
        _prodMerchandising: {
          merchcategory1: name,
          merchcategory2: guid,
          merchcategory3: category,
        },
      };
    });

    const data = {
      productListItems,
    };

    this.dataLayer.push(data);
  }

  /* eslint-disable max-len */
  /**
   * Dispatch this event when the user completes an order (i.e. buys something)
   *
   * @param {string} eventName the subscription step (create, change, upgrade, downgrade, restart)
   * @param {AnalyticsUserInfo} userData
   * @param {AnalyticsOrderInfo} orderData
   * @param {AnalyticsProductInfo[]} productData
   *
   * @example
   * const userData = {'2343aa2343', '2343aa2343', 'logged-in', 'lead', 'paid', 'one-stair-step',
   *                  'sling-orange', 'domestic' 'us'}
   * const orderData = {'123456', '9.9', '13.99',
   *                   '4.0', 'USD', 'alacarte',
   *                   'one-stair-step', 'MASCT881146', 'AVQ2QPYHRHQGJKPH8', 'sub-create'};
   * const productData = [{'12312', 'name', '1111', '11.00'}];
   * analytics.order('create', orderData, productData)
   * analytics.cartStep('products', cartData, pageData) //See cartStep docs for values
   *
   * //eslint-enable max-len
   */
  order(
    eventName,
    userData,
    {
      orderId: orderIdOriginal,
      subtotal: subtotalOriginal,
      total: totalOriginal,
      tax: taxOriginal,
      currency,
      cartName,
      planName,
      offerName,
      promoCode,
      giftCard: giftCardOriginal,
      type,
    },
    productData,
  ) {
    const subStepName = eventNames.order[eventName];
    const subscriptionChangeEvents =
      ['sub_change', 'sub_upgrade', 'sub_downgrade'].reduce((prev, cur) => {
        return {
          ...prev,
          [cur]: cur.replace('_', '-'),
        };
      }, {});

    if (!subStepName) {
      analyticsWarn('Unknown event name in order subscription event');
      return;
    }

    if (!productData) {
      analyticsWarn('Either order data or product data is undefined');
      return;
    }

    // The API is not called with the same param names, so fixing it here
    //   then passing the info along to the update function.
    const fixedUserData = {
      guid: userData.userGuid,
      status: userData.accountStatus,
      ...userData
    };

    this.updateUserData(fixedUserData);
    this.updateProductListItems(productData);

    const orderSubChangeType = subscriptionChangeEvents[subStepName];

    // XXX Data fix to be removed later XXX
    let giftCard = giftCardOriginal;
    if (Array.isArray(giftCard)) {
      giftCard = giftCard.join(',');
    }
    const subtotal = subtotalOriginal?.toString?.();
    const total = totalOriginal?.toString?.();
    const tax = taxOriginal?.toString?.();
    const orderId = orderIdOriginal?.toString?.();
    // XXX End data fix

    const dataForOrder = {
      event: subStepName,
      commerce: {
        order: {
          orderTax: tax,
          shippingAmount: undefined, // TODO currently not tracked
          // activationFeesAmount: undefined, // not used
          discountAmount: undefined, //  TODO currently not tracked
          // serviceFees: undefined, //  not used
          purchaseID: orderId,
          hashedPurchaseID: orderId, // TODO verify if this is ok
          promoCode,
          _sling: {
            subtotal,
            total,
            currency,
            cartName,
            giftCard,
            planName,
            offerName,
            orderType: type,
            orderSubChangeType,
          },
        },
      },
      web: {
        currentEvent: subStepName,
      },
    };

    this.dataLayer.push(dataForOrder);
  }

  /**
   * Dispatch this event when a "step" page loads.
   * A "step" page is a generic concept very similar to the cart "step" page(s).
   *
   * @param {string} name - The name of the step
   * @param {*} eventData - Plain Object containing the event data.
   *
   * @see {@linkcode validSteps}
   *
   * @example
   * const data = {
   *   name: 'cancel-rebuttal-page',
   *   lineOfBusiness: 'domestic',
   *   classification: 'domestic',
   *   type: 'cancel',
   *   lang: 'en'
   * };
   * analytics.step('cancelStart', data, false);
   */
  step(name, eventData) {
    if (typeof validSteps[name] === 'undefined') {
      analyticsWarn(`Event "${name}" is not a valid event`);
      return;
    }

    const pageData = {
      ...eventData,
      type: stepPageTypeOverrides[name] ?? eventData.type,
    };

    this.updatePageData(pageData);

    const eventName = validSteps[name] ?? eventNames.screenLoad;

    // This is essentially a screen load event, so nothing beyond that is needed.
    const data = {
      event: eventName,
      web: {
        currentEvent: eventName,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when a search starts
   * @example
   * analytics.searchStart();
   */
  searchStart() {
    const data = {
      event: eventNames.search.begin,
      web: {
        currentEvent: eventNames.search.begin,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when user click on serch
   * @param {*} obj
   * @param {String} obj.searchValue
   *
   * @example
   * const obj = {
   * searchValue: "test"
   * }
   * analytics.searchComplete(obj);
   */
  searchComplete({ searchValue }) {
    if (!searchValue) {
      analyticsWarn('Could not find "searchValue" argument in searchComplete');
      return;
    }

    const data = {
      event: eventNames.search.complete,
      search: {
        searchDetails: {
          searchTerm: searchValue,
          searchResults: undefined, // TODO do we need this?
        },
      },
      web: {
        currentEvent: eventNames.search.complete,
      },
    };

    this.dataLayer.push(data);
  }
  /**
   * Dispatch this event when a pause starts
   * @example
   * analytics.pauseStart()
   */
  pauseStart() {
    const data = {
      event: eventNames.pause.start,
      web: {
        currentEvent: eventNames.pause.start,
      },
    };

    this.dataLayer.push(data);
  }

  /**
   * Dispatch this event when a sub pause confirm
   * @example
   * analytics.confirmSubPause()
   */
  confirmSubPause({
    pauseDuration
  }) {
    const data = {
      event: eventNames.pause.end,
      web: {
        currentEvent: eventNames.pause.end,
        user: {
          _sling: {
            pauseDuration
          }
        }
      },
    };

    this.dataLayer.push(data);
  }
}

let instance;

/**
 * Get an instance of AnalyticsADL. It may return a singleton.
 *
 * @param {string} appName
 * @returns {AnalyticsADL}
 */
export function getInstance(appName) {
  if (!instance) {
    const handler = {
      get(target, prop) {
        const fn = target[prop];

        if (!fn) {
          analyticsError(`Property ${prop} accessed, but does not exist.`
            + ' If this is a function call, it will silently fail as a no-op.'
            + ' This needs to be fixed in the calling code.'
          );

          return () => { /* intentionally empty */ };
        }

        return (...args) => {
          try {
            return target[prop](...args);
          } catch (e) {
            analyticsError(e);
          }

          return undefined;
        };
      }
    };

    window.adobeDataLayer = window.adobeDataLayer ?? [];

    instance = new Proxy(new AnalyticsADL(appName, window.adobeDataLayer), handler);

    // Add debug data to the data layer
    instance.updateDebugData();

    // Set the page-defaults
    instance.updatePageData({
      name: 'unknown',
      lineOfBusiness: 'unknown',
      classification: 'unknown',
      type: 'generic',
      lang: 'en',
      domain: window.location.hostname,
    });

    instance.updatePageAccessInfo();

    const urlSearchParams = new URLSearchParams(window.location.search);
    instance.updateUrlParamsData(urlSearchParams);

    if (localStorage.getItem('adobeDataLayer.web.user')) {
      try {
        instance.updateUserData(JSON.parse(localStorage.getItem('adobeDataLayer.web.user')));
      } catch (e) {
        analyticsError(e);
      }
    }

    // Set up a listener
    window.addEventListener('load', () => {
      instance.updatePerformanceData();
    });
  }

  return instance;
}
