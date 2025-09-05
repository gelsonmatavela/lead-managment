import prisma from "../../utils/prisma/index.js";
import { PrismaQueryOptions } from 'arkos/prisma';

const userQueryOptions: PrismaQueryOptions<typeof prisma.user> = {
    global: {},
    find: {
      omit: {
        password: true,
      }, 
      include: {
        roles: {
          include: {
            role: true,
          }
        },
      },
    },
    findOne: {
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        },
      },
    },
    findMany: {},
    update: {},
    updateMany: {},
    updateOne: {},
    create: {},
    createMany: {},
    createOne: {},
    save: {
      omit: {
        password: true,
      },
    },
    saveMany: {},
    saveOne: {},
    delete: {},
    deleteMany: {},
    deleteOne: {},
}

export default userQueryOptions;
