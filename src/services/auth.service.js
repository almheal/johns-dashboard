import { request } from "./request";

const registerUser = (body) =>
  request({ url: "auth/admin/register", method: "post", body });
const authUser = () => request({ url: "/auth/admin", method: "get" });
const loginUser = (body) =>
  request({ url: "/auth/admin/login", method: "post", body });

export { registerUser, authUser, loginUser };
