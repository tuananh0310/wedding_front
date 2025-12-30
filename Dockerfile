FROM node:18-alpine AS build

# Install git và các dependencies cần thiết cho bower
RUN apk add --no-cache git python3 make g++

WORKDIR /app

# Install toolchain and deps first (better layer caching)
COPY package.json bower.json ./
RUN npm install -g bower \
 && npm install --production=false \
 && bower install --allow-root --config.interactive=false \
 && npm cache clean --force \
 && rm -rf /tmp/* /var/tmp/*

# Copy the rest and build
COPY . .
RUN npm run build \
 && rm -rf node_modules bower_components .tmp \
 && rm -rf /root/.npm /root/.cache \
 && npm cache clean --force \
 && rm -rf /tmp/* /var/tmp/*

# ---- runtime ----
FROM nginx:1.25-alpine AS runtime

# Copy từ dist (đã được build và nén) thay vì app (ảnh gốc chưa nén)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config for optimal caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

