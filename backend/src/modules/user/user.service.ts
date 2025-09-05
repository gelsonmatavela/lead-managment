import prisma from "../../utils/prisma";
import { BaseService } from "arkos/services";

class UserService extends BaseService<typeof prisma.user> {
  constructor() {
    super("user");
  }
  // Add your custom service methods here
}

const userService = new UserService();

export default userService;
