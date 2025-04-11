export default () => ({
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT) || 3000,
    context: { path: process.env.CONTEXT_API || 'api' },
  },
});
