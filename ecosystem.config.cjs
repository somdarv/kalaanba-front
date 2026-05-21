// PM2 ecosystem file for production deploy on the Next node.
// Run: pm2 start ecosystem.config.cjs --env production
module.exports = {
    apps: [
        {
            name: "kalaanba-front",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            cwd: ".",
            instances: "max",
            exec_mode: "cluster",
            max_memory_restart: "512M",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
            error_file: "./storage/logs/pm2-error.log",
            out_file: "./storage/logs/pm2-out.log",
            time: true,
        },
    ],
};
