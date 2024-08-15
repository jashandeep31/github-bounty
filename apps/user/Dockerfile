FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/user/package*.json ./


COPY . .
RUN npm install

RUN rm -rf /app/apps/backend
RUN rm -rf /app/apps/maintainer

# RUN npm run build --filter=@repo/db --filter=@repo/ui
WORKDIR /app/packages/db
RUN npx prisma generate

WORKDIR /app/apps/user
RUN npm run build

EXPOSE 3000


CMD ["npm", "start"]