export const setLocalStorage = ({ key, data }) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const setDynamicItemLocalStorage = ({ data, key, property }) => {
  let obj = getLocalStorage(key);
  if (!obj) {
    obj = {};
  }
  obj[property] = data;
  setLocalStorage({ key, data: obj });
};

export const getDynamicPropertyLocalStorage = ({
  key,
  property,
  defaultValue = "",
}) => {
  let obj = getLocalStorage(key);
  if (!obj || !obj[property]) {
    setDynamicItemLocalStorage({ data: defaultValue, key, property });
    return defaultValue;
  }

  return obj[property];
};

export const resetObjProperties = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key].__proto__ === Object.prototype) {
      acc[key] = resetObjProperties(obj[key]);
    } else if (Array.isArray(obj[key])) {
      acc[key] = [];
    } else {
      acc[key] = "";
    }

    return acc;
  }, {});
};

export const calculatePagination = ({ limit, page }) => {
  if (page < 1 || !page) {
    page = 1;
  }
  const skip = limit * page - limit;
  return { limit, skip };
};
