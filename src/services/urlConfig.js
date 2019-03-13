const developmentBaseUrl = 'https://api.dev.consulting.com/';
const developmentNewApiProperty = 'https://staging-dot-marketingmanager-195121.appspot.com';

const localDevelopmentBaseUrl = process.env.BASE_URL;
const localDevelopmentNewApiProperty = process.env.NEW_API_PROPERTY;

const stagingBaseUrl = 'https://marketingmanager-staging.appspot.com';
const stagingNewApiProperty = 'https://marketingmanager-staging.appspot.com';

const productionBaseUrl = 'https://marketingmanager-195121.appspot.com';
const productionNewApiProperty = '';

const urlConfig = () => {
  let baseURL;
  let newApiProperty;

  switch (process.env.NODE_ENV) {
    case 'development':
      baseURL = developmentBaseUrl;
      newApiProperty = developmentNewApiProperty;
      break;
    case 'local_development':
      baseURL = localDevelopmentBaseUrl;
      newApiProperty = localDevelopmentNewApiProperty;
      break;
    case 'staging':
      baseURL = stagingBaseUrl;
      newApiProperty = stagingNewApiProperty;
      break;
    case 'production':
      baseURL = productionBaseUrl;
      newApiProperty = productionNewApiProperty;
      break;
    default: break;
  }

  return { baseURL, newApiProperty };
};

export const { baseURL, newApiProperty } = urlConfig();
