import prisma from "../../utils/prisma/index.js";
import { PrismaQueryOptions } from 'arkos/prisma';

const authRoleQueryOptions: PrismaQueryOptions<typeof prisma.authRole> = {
    global: {},
    find: {},
    findOne: {
        include: {
          permissions: true
        },
    },
    findMany: {},
    update: {},
    updateMany: {},
    updateOne: {},
    create: {},
    createMany: {},
    createOne: {},
    save: {},
    saveMany: {},
    saveOne: {},
    delete: {},
    deleteMany: {},
    deleteOne: {},
}

export default authRoleQueryOptions;
