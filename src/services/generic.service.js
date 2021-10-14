import { request } from "./request";

const genericService = (url) => ({
  create(body) {
    return request({ url, method: "post", body });
  },
  get(id, query = {}) {
    return request({ url: `${url}/${id}`, method: "get", query });
  },
  getAll(query) {
    return request({ url, method: "get", query });
  },
  update(id, body) {
    return request({ url: `${url}/${id}`, method: "put", body });
  },
  delete(id) {
    return request({ url: `${url}/${id}`, method: "delete" });
  },
});

export default genericService;
