export const buildContext = () => ({
  namespace: typeof __NAMESPACE__ !== 'undefined' && __NAMESPACE__ ? __NAMESPACE__ : 'benji-connect-sdk',
  version: typeof __VERSION__ !== 'undefined' && __VERSION__ ? String(__VERSION__) : '0.0.0',
});