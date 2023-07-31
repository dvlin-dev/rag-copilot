module.exports = {
  apps: [
    {
      name: 'devlink-web',
      script: 'npm',
      args: 'start',
      instances: 'max',
      autorestart: true, // 应用崩溃时自动重启
      watch: false, // 不要监视文件更改
      max_memory_restart: '1G', // 如果应用使用超过 1GB 内存，自动重启
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
