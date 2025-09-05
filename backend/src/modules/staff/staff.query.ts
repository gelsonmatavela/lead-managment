import { prisma } from "../../utils/prisma";
import { PrismaQueryOptions } from "arkos/prisma";

const StaffPrismaQueryOptions: PrismaQueryOptions<typeof prisma.staff> = {
  global: {
    include:{
        user: true,
        companyAsLeader: true,
    }
  },
};

export default StaffPrismaQueryOptions;
