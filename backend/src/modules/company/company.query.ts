import { prisma } from "../../utils/prisma";
import { PrismaQueryOptions } from "arkos/prisma";

const CompanyPrismaQueryOptions: PrismaQueryOptions<typeof prisma.company> = {
  global: {
    include:{
        staffs: true,
        address: true,
        leaders: true,
    }
  },
};

export default CompanyPrismaQueryOptions;
