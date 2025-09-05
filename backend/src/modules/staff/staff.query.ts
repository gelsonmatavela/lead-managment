import { prisma } from "../../utils/prisma";
import { PrismaQueryOptions } from "arkos/prisma";

const StaffPrismaQueryOptions: PrismaQueryOptions<typeof prisma.staff> = {
  global: {
    include:{
        user: true,
        companyAsLeader: true,
        company: true,
    }
  },
};

export default StaffPrismaQueryOptions;
