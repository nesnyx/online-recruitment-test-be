module.exports = {
  apps: [{
    name: "rs-backend-app",
    script: "./dist/main.js", // path ke file utama kamu
    instances: 2,             // Jumlah instance yang kamu inginkan
    exec_mode: "cluster",     // WAJIB untuk menjalankan mode cluster
    autorestart: true,
    watch: false,
    max_memory_restart: '1G', // Restart jika satu instance makan RAM > 1GB
    env: {
      NODE_ENV: "production",
    }
  }]
}