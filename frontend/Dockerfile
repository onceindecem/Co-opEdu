FROM node:20-alpine

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN set -a && . ./.env.production && set +a && npm run build

EXPOSE 5173
CMD ["npm", "run", "start"]