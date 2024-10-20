export default () => ({
  server: {
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
    contextPath: process.env.CONTEXT_API || 'api',
  },
});
