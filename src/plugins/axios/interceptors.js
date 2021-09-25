import { USER_TOKEN_NAME } from "../../consts";
import { getLocalStorage, setLocalStorage } from "@/utils";
import { errorsHandler } from "./errorsHandler";
import { notificationHandler } from "./notificationHandler";

function responseHandler(response) {
  const { data: body } = response;

  if (body.token) {
    response.data = { user: body.user };
    setLocalStorage({ key: USER_TOKEN_NAME, data: body.token });
  }

  if (body.message) {
    notificationHandler(body.message);
  }

  if (body.data && !body.length) {
    response.data = body.data;
  }

  if (body.data && body.length) {
    response.data = body;
  }

  return response;
}

function AuthorizationTokenHeader(request) {
  const token = getLocalStorage(USER_TOKEN_NAME);
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }

  return request;
}

function interceptors(axios) {
  axios.interceptors.response.use(responseHandler, errorsHandler);
  axios.interceptors.request.use(AuthorizationTokenHeader);
}

export default interceptors;
