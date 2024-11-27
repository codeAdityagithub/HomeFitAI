import {
  ClientActionFunction,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { singleton } from "./singleton.client";

const cache = singleton("clientCache", () => new Map());

export const deleteKey = (key: string) => {
  if (cache.has(key)) cache.delete(key);
};
const clientLoader = async ({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url);
  const key = url.pathname + url.search;
  if (cache.has(key)) return cache.get(key);
  console.log(key);
  const data = await serverLoader();
  if (data) cache.set(key, data);
  return data;
};

clientLoader.hydrate = true;

const clientAction: ClientActionFunction = async ({
  request,
  serverAction,
}) => {
  const res = await serverAction<any>();
  const key = new URL(request.url).pathname;

  if (res && !res.error) cache.delete(key);
  return res;
};

const cacheClientLoader = async (key: string, serverLoader: () => any) => {
  if (cache.has(key)) return cache.get(key);
  const data = await serverLoader();
  if (data) cache.set(key, data);
  return data;
};

const cacheClientAction = async (keys: string[], serverAction: () => any) => {
  const res = await serverAction();
  if (res && !res.error) keys.forEach((key) => cache.delete(key));

  return res;
};

export { cacheClientAction, cacheClientLoader, clientAction, clientLoader };
