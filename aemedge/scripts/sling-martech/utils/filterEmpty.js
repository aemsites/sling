function filterEmpty(obj) {
  const newObj = {};
  Object.keys(obj)
    .forEach((k) => {
      if (typeof obj[k] !== 'undefined') {
        newObj[k] = obj[k];
      }
    });
  return newObj;
}

export default filterEmpty;
