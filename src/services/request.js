import axios from "@/plugins/axios";

export const request = async ({ url, method, body = {} }) => {
  return await axios[method](url, body);
};
