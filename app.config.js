const appJson = require('./app.json');

const projectId = process.env.EAS_PROJECT_ID || appJson.expo.extra?.eas?.projectId;

if (!projectId) {
  throw new Error(
    'EAS_PROJECT_ID is required. Set the GitHub Actions repository variable after linking RainX to its Expo EAS project.'
  );
}

module.exports = {
  ...appJson.expo,
  updates: {
    ...appJson.expo.updates,
    url: `https://u.expo.dev/${projectId}`
  },
  extra: {
    ...appJson.expo.extra,
    eas: {
      ...appJson.expo.extra?.eas,
      projectId
    }
  }
};
