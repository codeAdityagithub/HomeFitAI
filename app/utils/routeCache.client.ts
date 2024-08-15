import {
  ClientActionFunction,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";

const cache = new Map();

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

export { clientLoader, clientAction };
