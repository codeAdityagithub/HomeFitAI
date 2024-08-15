import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";

type MethodHandlers = {
  POST?: ActionFunction;
  PUT?: ActionFunction;
  PATCH?: ActionFunction;
  DELETE?: ActionFunction;
  // [key: string]: ActionFunction | undefined;
};

export const multiAction = (handlers: MethodHandlers): ActionFunction => {
  return async (args: ActionFunctionArgs) => {
    const { request } = args;
    const method = request.method.toUpperCase();
    if (
      method !== "POST" &&
      method !== "PUT" &&
      method !== "DELETE" &&
      method !== "PATCH"
    )
      return new Response("Method not allowed", { status: 405 });

    const handler = handlers[method];
    if (handler) {
      return handler(args);
    }
  };
};
