/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const rootMain = require('../../../../.storybook/main');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(
  ...['../src/lib/**/*.stories.mdx', '../src/lib/**/*.stories.@(js|jsx|ts|tsx)']
);

module.exports = rootMain;
