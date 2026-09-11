const appJson = require('./app.json');

const projectId = process.env.EAS_PROJECT_ID || appJson.expo.extra?.eas?.projectId;

module.exports = {
  ...appJson.expo,
  updates: projectId
    ? {
        ...appJson.expo.updates,
        enabled: true,
        url: `https://u.expo.dev/${projectId}`
      }
    : {
        ...appJson.expo.updates,
        enabled: false
      },
  extra: {
    ...appJson.expo.extra,
    ...(projectId
      ? {
          eas: {
            ...appJson.expo.extra?.eas,
            projectId
          }
        }
      : {})
  }
};
