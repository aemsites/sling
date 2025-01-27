import { getInstance } from './AnalyticsADL.js';

// Intentionally not using default export, to force clients to fix themselves
/**
 * Get an instance of AnalyticsADL
 *
 * @type {function(string): AnalyticsADL}
 */
// eslint-disable-next-line import/prefer-default-export
export const getAnalyticsInstance = getInstance;
// setting the analytics instance on window object
(() => {
    console.log(`instantiate analtics instance `)
    window.sling.anlyticsInstance = getInstance('sling');
})();

