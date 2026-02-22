FROM node:20-alpine AS builder
WORKDIR /app

# 1. Dépendances d'abord (cache Docker optimisé)
COPY package*.json ./
RUN npm install

# 2. Copier TOUT le projet (index.html + src/ + vite.config.js etc.)
COPY . .

# 3. Build
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ── Production — Nginx ────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]