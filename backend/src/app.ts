import arkos from 'arkos';

arkos.init({
  cors: {
    allowedOrigins: process.env.NODE_ENV !== "production" ? "*" : "your-production-url"
  },
  authentication: {
    mode: 'dynamic',
    login: {
      allowedUsernames: ['email', 'name'],
    }
  },
  validation: {
    resolver: 'class-validator'
  },
  swagger: {
    mode: 'class-validator', 
    strict: false,
  }
});
