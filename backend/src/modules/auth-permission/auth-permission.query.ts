import prisma from "../../utils/prisma/index.js";
import { PrismaQueryOptions } from 'arkos/prisma';

const authPermissionQueryOptions: PrismaQueryOptions<typeof prisma.authPermission> = {
    global: {},
    find: {
        include: {
            role: true
        },
    },
    findOne: {},
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

export default authPermissionQueryOptions;
