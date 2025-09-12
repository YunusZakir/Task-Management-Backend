export const config = {
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '12345',
    database: process.env.DB_NAME || 'task_mgmt',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'yunuszakir830@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
};