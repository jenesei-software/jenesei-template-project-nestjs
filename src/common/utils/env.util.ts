function isEnvFlagEnabled(key: string): boolean {
  return ['true', '1', 'yes', 'on'].includes(key?.toLowerCase().trim());
}
export { isEnvFlagEnabled };
