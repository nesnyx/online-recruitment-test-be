#!/bin/bash

npm run build
pm2 start dist/server.js --name "server" && pm2 log server