import { PrismaClient } from "@prisma/client";
import { singleton } from "./singleton.server";
import { decrypt, encrypt, encryptEmail } from "./encrypt.server";

let db = singleton("db", () => {
  return new PrismaClient().$extends({
    name: "encrypt",
    query: {
      user: {
        findUnique: async ({ args, query }) => {
          if (args.where?.email)
            args.where = {
              ...args.where,
              email: encryptEmail(args.where.email),
            };
          const user = await query(args);
          if (user && user.username) {
            user.username = decrypt(user.username);
          }
          return user;
        },
        create: async ({ args, query }) => {
          args.data.email = encryptEmail(args.data.email);
          args.data.username = encrypt(args.data.username);
          const user = await query(args);
          return { ...user, username: decrypt(args.data.username) };
        },
      },
    },
  });
});

export default db;
