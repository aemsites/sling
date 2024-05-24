import ffetch from './ffetch.js';

function titleToName(name) {
  return name.toLowerCase().replace(' ', '-');
}

const tagsEndpoint = '/tags.json';
let tagsPromise;
function fetchTags() {
  if (!tagsPromise) {
    tagsPromise = new Promise((resolve, reject) => {
      (async () => {
        try {
          const tagsJson = await ffetch(tagsEndpoint).all();
          const tags = {};
          let curType;
          let l1;
          tagsJson.forEach((row) => {
            if (row.Type) {
              curType = row.Type;
              tags[curType] = {
                title: curType,
                name: titleToName(curType),
              };
            }

            if (row['Level 1']) {
              l1 = row['Level 1'];
              tags[curType][l1] = {
                title: l1,
                name: titleToName(l1),
              };
            }
          });
          resolve(tags);
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  return tagsPromise;
}

const getDeepNestedObject = (obj, filter) => Object.entries(obj)
  .reduce((acc, [key, value]) => {
    let result = [];
    if (key === filter) {
      result = acc.concat(value);
    } else if (typeof value === 'object') {
      result = acc.concat(getDeepNestedObject(value, filter));
    } else {
      result = acc;
    }
    return result;
  }, []);

/**
 * Get the tags a a hierarchical json object
 * @returns {Promise} the tags
 */
export function getTags() {
  return fetchTags();
}

/**
 * Returns a tags category as an array of objects
 * @param {*} category
 */
export const gettagsCategory = async (category) => {
  const tags = await getTags();
  return getDeepNestedObject(tags, category)[0];
};
