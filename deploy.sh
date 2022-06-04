#!/usr/bin/env bash
#docker-compose down
#docker-compose build
#docker-compose up -d
npm run build --prod
cp -r dist /var/www/html
service nginx stop
rm -rf /var/cache/nginx/*
service nginx start
exit 0
