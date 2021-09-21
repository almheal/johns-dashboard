import { request } from "./request";

export const requestCreateImage = (body) =>
  request({ url: "/images", method: "post", body });
