import { AuthConfigs } from "arkos/auth"

const authRoleAuthConfigs: AuthConfigs = {
  authenticationControl: {
    Create: true,
    Update: true,
    Delete: true,
    View: true,
  },
};

export default authRoleAuthConfigs;
