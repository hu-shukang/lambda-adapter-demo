import { json, redirect } from '@remix-run/node';
import { Cookie as CookieUtil } from './cookie.util';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Cognito } from './cognito.util';
import { dateUtil } from '~/lib/date.util';

const THIRTY_MINUTES = 30 * 60;

const refreshIdTokenCookie = async (request: Request, headers: Headers, payload?: CognitoIdTokenPayload) => {
  const cookie = CookieUtil.idToken;
  const now = dateUtil.unix();
  let cookieValue;
  if (payload && payload.exp - now < THIRTY_MINUTES) {
    console.log('Token will expire in less than 30 minutes. Attempting to refresh...');
    const refreshToken = await CookieUtil.refreshToken.parse(request.headers.get('Cookie'));
    if (refreshToken) {
      cookieValue = await Cognito.refreshIdTokenByRefreshToken(refreshToken);
    }
  } else {
    cookieValue = await cookie.parse(request.headers.get('Cookie'));
  }

  if (cookieValue) {
    headers.append('Set-Cookie', await cookie.serialize(cookieValue));
  }
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

const sendJson = async (request: Request, data: any, init?: number | ResponseInit, payload?: CognitoIdTokenPayload) => {
  const respInit: ResponseInit = {};
  let headers = new Headers();
  if (typeof init === 'number') {
    respInit.status = init;
  } else if (init != undefined) {
    headers = formatHeaders(init.headers);
  }
  await refreshIdTokenCookie(request, headers, payload);
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
