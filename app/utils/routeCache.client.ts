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
  cache.set(request.url, data);
  return data;
};

clientLoader.hydrate = true;

const clientAction: ClientActionFunction = async ({
  request,
  serverAction,
}) => {
  cache.delete(request.url);
  return await serverAction();
};

const cacheClientLoader = async (key: string, serverLoader: () => any) => {
  if (cache.has(key)) return cache.get(key);
  const data = await serverLoader();
  cache.set(key, data);
  return data;
};
const cacheClientAction = async (key: string, serverAction: () => any) => {
  cache.delete(key);
  return await serverAction();
};

export { clientLoader, clientAction, cacheClientLoader, cacheClientAction };
