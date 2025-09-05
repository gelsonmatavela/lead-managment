import prisma from "../src/utils/prisma";

(async () => {
  const requests = await prisma.request.findMany({
    include: {
      staff: true,
    },
  });

  requests.forEach(async (request) => {
    const requestUpdated = await prisma.request.update({
      where: { id: request.id },
      data: {
        departmentId: request.staff.departmentId,
      },
    });

    //@ts-ignore
    console.log(requestUpdated.id, requestUpdated.departmentId, "udpated");
  });
})();
