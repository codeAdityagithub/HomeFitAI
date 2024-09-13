import {
  ClientActionFunction,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { singleton } from "./singleton.client";

const cache = singleton("clientCache", () => new Map());

const clientLoader = async ({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  if (cache.has(request.url)) return cache.get(request.url);
  const data = await serverLoader();
  if (data) cache.set(request.url, data);
  return data;
};

clientLoader.hydrate = true;

const clientAction: ClientActionFunction = async ({
  request,
  serverAction,
}) => {
  const res = await serverAction<any>();
  if (res && !res.error) cache.delete(request.url);
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

export { clientLoader, clientAction, cacheClientLoader, cacheClientAction };
