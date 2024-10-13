import { Cookie, json, redirect } from '@remix-run/node';
import { Cookie as CookieUtil } from './cookie.util';

const refreshCookie = async (request: Request, cookie: Cookie, headers: Headers) => {
  const cookieValue = await cookie.parse(request.headers.get('Cookie'));
  if (cookieValue) {
    headers.append('Set-Cookie', await cookie.serialize(cookieValue));
  }
};

const refreshIdTokenCookie = async (request: Request, headers: Headers) => {
  const cookie = CookieUtil.idToken;
  await refreshCookie(request, cookie, headers);
};

const formatHeaders = (headers?: HeadersInit): Headers => {
  let result = new Headers();
  if (headers instanceof Headers) {
    result = headers;
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      result.append(key, value);
    });
  } else if (typeof headers === 'object' && headers !== null) {
    Object.entries(headers).forEach(([key, value]) => {
      result.append(key, value);
    });
  }
  return result;
};

const sendJson = async (request: Request, data: any, init?: number | ResponseInit) => {
  const respInit: ResponseInit = {};
  let headers = new Headers();
  if (typeof init === 'number') {
    respInit.status = init;
  } else if (init != undefined) {
    headers = formatHeaders(init.headers);
  }
  await refreshIdTokenCookie(request, headers);
  respInit.headers = headers;
  return json(data, respInit);
};

const sendRedirect = async (request: Request, url: string, init?: number | ResponseInit) => {
  const respInit: ResponseInit = {};
  let headers = new Headers();
  if (typeof init === 'number') {
    respInit.status = init;
  } else if (init != undefined) {
    headers = formatHeaders(init.headers);
  }
  await refreshIdTokenCookie(request, headers);
  respInit.headers = headers;
  return redirect(url, respInit);
};

export const Resp = {
  json: sendJson,
  simpleJson: json,
  redirect: sendRedirect,
  simpleRedirect: redirect,
};
