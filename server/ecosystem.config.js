module.exports = {
  apps: [
    {
      name: 'docs-copilot-server',
      script: 'npm',
      args: 'run start:prod',
      watch: ['./dist'],
      ignore_watch: ['node_modules'],
    },
  ],
};
// cross-env NODE_ENV=production pm2 start dist/src/main.js --name docs-copilot
