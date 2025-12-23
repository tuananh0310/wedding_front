FROM node:18-bullseye AS build

WORKDIR /app

# Install toolchain and deps first (better layer caching)
COPY package.json bower.json ./
RUN npm install -g bower \
 && npm install \
 && bower install --allow-root --config.interactive=false

# Copy the rest and build
COPY . .
RUN npm run build

# ---- runtime ----
FROM nginx:1.25-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/app/images /usr/share/nginx/html/images
COPY --from=build /app/app/apple-touch-icon.png /usr/share/nginx/html/
COPY --from=build /app/app/favicon.ico /usr/share/nginx/html/

# Default nginx config is enough for static files
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

