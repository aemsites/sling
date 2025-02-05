import ffetch from './ffetch.js';

const tagsEndpoint = '/aemedge/tags.json';
const colorsEndpoint = '/aemedge/color-tags.json';

let tagsPromise;
const tagToPath = (
  (name) => {
    const path = name;
    if (name.toLowerCase().includes(' & ')) {
      return name.toLowerCase().replace(' & ', '-and-');
    }
    if (name.toLowerCase().includes(' ')) {
      return name.toLowerCase().replace(' ', '-');
    }
    return path.toLowerCase();
  }
);
const fetchTags = (() => {
  if (!tagsPromise) {
    tagsPromise = new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await fetch(tagsEndpoint);
          const tagsJson = await response.json();
          const tags = {};
          let root;
          let l1;
          let l2;
          tagsJson.data.forEach((row) => {
            if (row.root) {
              root = row.root;
              tags[root] = {
                title: root,
                name: tagToPath(root),
              };
            }

            if (row.level1) {
              l1 = row.level1;
              tags[root][l1] = {
                title: l1,
                name: tagToPath(l1),
              };
            }
            if (row.level2) {
              l2 = row.level2;
              tags[root][l1][l2] = {
                title: l2,
                name: `${tagToPath(l1)}/${tagToPath(l2)}`,
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
});

const getDeepNestedObject = (obj, filter) => Object.entries(obj)
  .reduce((acc, [key, value]) => {
    let result = [];
    if (key.toLowerCase() === filter.toLowerCase()) {
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
export const getTag = async (tag) => {
  const tags = await getTags();
  return getDeepNestedObject(tags, tag)[0];
};

/* color chips rendering */
let palettePromise;
function fetchPalette(sheet) {
  if (!palettePromise) {
    palettePromise = new Promise((resolve, reject) => {
      (async () => {
        try {
          const paletteJson = await ffetch(colorsEndpoint, sheet).all();
          resolve(paletteJson);
        } catch (e) {
          reject(e);
        }
      })();
    });
  }
  return palettePromise;
}

export async function getPalette() {
  return fetchPalette('palette');
}
