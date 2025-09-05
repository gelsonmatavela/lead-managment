import prisma from "../../utils/prisma/index.js";
import { AuthPrismaQueryOptions } from 'arkos/prisma';

const authQueryOptions: AuthPrismaQueryOptions<typeof prisma.user> = {
  getMe: {
    omit: {
      password: true,
    }, 
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
  updateMe: {
    omit: {
      password: true,
    }, 
  },
  deleteMe: {},
  login: {},
  signup: {
    omit: {
      password: true,
    },
  },
  updatePassword: {},
}

export default authQueryOptions;
