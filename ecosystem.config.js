module.exports = {
  apps: [{
    name: "server",
    script: "./dist/server.js", 
    instances: 2,             
    exec_mode: "cluster",     
    autorestart: true,
    watch: false,
    max_memory_restart: '1G', 
    env: {
      NODE_ENV: "development",
      PORT:4401
    }
  }]
}