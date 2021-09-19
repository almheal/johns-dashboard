import axios from "@/plugins/axios";

export const request = async ({ url, method, body = {}, query = {} }) => {
  return await axios[method](url + generateQueryParams(query), body);
};

const generateQueryParams = (params) => {
  const keys = Object.keys(params);
  if (!keys.length) {
    return "";
  }
  return Object.keys(params).reduce((acc, key, index) => {
    acc += `${index ? "&" : ""}${key}=${params[key]}`;
    return acc;
  }, "?");
};
