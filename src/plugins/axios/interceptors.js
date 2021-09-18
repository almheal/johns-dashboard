import { USER_TOKEN_NAME } from "../../consts";
import { getLocalStorage, setLocalStorage } from "@/utils";
import { errorsHandler } from "./errorsHandler";
import { notificationHandler } from "./notificationHandler";
import { SUCCESS_MESSAGE_CODES } from "../../consts/success";

function setUserToken(response) {
  const { data: body } = response;
  const STATUS_CREATED = 201;

  if (body.data && body.data.token) {
    setLocalStorage({ key: USER_TOKEN_NAME, data: body.data.token });
  }

  if (response.status === STATUS_CREATED && !body.message) {
    notificationHandler([SUCCESS_MESSAGE_CODES.CREATED]);
  }

  if (body.message) {
    notificationHandler(body.message);
  }

  if (body.data) {
    response.data = body.data;
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
  axios.interceptors.response.use(setUserToken, errorsHandler);
  axios.interceptors.request.use(AuthorizationTokenHeader);
}

export default interceptors;
