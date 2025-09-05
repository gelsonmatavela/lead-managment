import { AuthConfigs } from "arkos/auth"

const userAuthConfigs: AuthConfigs = {
  authenticationControl: {
    Create: true,
    Update: true,
    Delete: true,
    View: true,
  },
};

export default userAuthConfigs;
