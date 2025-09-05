import { AuthConfigs } from "arkos/auth"

const authPermissionAuthConfigs: AuthConfigs = {
  authenticationControl: {
    Create: true,
    Update: true,
    Delete: true,
    View: true,
  },
};

export default authPermissionAuthConfigs;
