require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "lead-manangment",
      script: "pnpm",
      args: "start",
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT
      },
    },
  ],
};