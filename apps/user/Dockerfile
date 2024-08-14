FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/user/package*.json ./


COPY . .
RUN npm install
RUN npm run build --filter=@repo/db --filter=@repo/ui


WORKDIR /app/apps/user
RUN npm run build

EXPOSE 3000


CMD ["npm", "start"]