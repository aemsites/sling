import { getInstance } from './AnalyticsADL.js';

(() => {
    window.analyticsInstance = getInstance;
    //sample usage
    //const myanalyticsInstance = window.anlyticsInstance('sling-martech');
    //myanalyticsInstance.updateLocalsZipCode(localStorage.getItem('user_zip'));
    //console.log(myanalyticsInstance.dataLayer);
})();

