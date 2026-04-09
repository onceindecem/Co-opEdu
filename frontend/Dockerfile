FROM node:20-alpine

ARG BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN set -a && . ./.env.production && set +a && npm run build

EXPOSE 5173
CMD ["npm", "start"]