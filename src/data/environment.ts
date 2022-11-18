/* eslint-disable complexity */
import { getUserProp } from '../functions';

interface EnvironmentConfiguration {
  api: { host: string; version: string };
  region: string;
  sandboxName: string;
  userName: string;
  userEmail: string;
}

function getEnvironment(): EnvironmentConfiguration {
  const env = process.env.REACT_APP_ENVIRONMENT || '';
  const region = process.env.REACT_APP_REGION || '';

  const conf = {
    api: {
      host: process.env.REACT_APP_CORE_BUSINESS_BFF_API || '',
      version: 'v1'
    },
    region: region || '',
    sandboxName: region || '',
    userName: '',
    userEmail: ''
  };

  if (env.indexOf('sandbox') !== -1 || env.indexOf('dev') !== -1) {
    const [, sandboxName] = region.split('-');
    conf.sandboxName = sandboxName;
    conf.userName = 'Test Account';
    conf.userEmail = 'test@thebeat.co';
  } else if (env.indexOf('staging') !== -1) {
    conf.region = `sandbox-${conf.sandboxName}`;
    conf.userName = getUserProp('name');
    conf.userEmail = getUserProp('email');
  } else if (env.indexOf('production') !== -1) {
    conf.region = region;
    conf.userName = getUserProp('name');
    conf.userEmail = getUserProp('email');
  }

  return conf;
}

export default getEnvironment();
