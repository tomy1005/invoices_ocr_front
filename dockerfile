# Etapa 1: Build de Angular
FROM node:18 AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:qa
RUN ls -l dist/facturas-mistral/browser

# Etapa 2: Servidor Nginx
FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist/facturas-mistral/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia configuración personalizada de Nginx si tienes
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]