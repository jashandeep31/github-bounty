FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/maintainer/package*.json ./


RUN npm install

COPY . .
# RUN npm run build --filter=@repo/db --filter=@repo/ui

WORKDIR /app/packages/db
RUN npx prisma generate

WORKDIR /app/apps/maintainer
RUN npm run build

EXPOSE 3001


CMD ["npm", "start"]