// prisma instantiation

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prismadb: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // in production, always create new instance of prisma
  prismadb = new PrismaClient();
}
// development environment
else {
  // check if there is any pre-existing instance of prisma client. If not, create a new instance
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prismadb = global.cachedPrisma;
}

export default prismadb;

// import { PrismaClient } from "@prisma/client"

// declare global {
//   var prisma: PrismaClient | undefined
// }

// const prismadb = globalThis.prisma || new PrismaClient()
// if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb
// export default prismadb;
