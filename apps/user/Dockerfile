FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/user/package*.json ./


COPY . .

RUN rm -rf /app/apps/user
RUN rm -rf /app/apps/backend

RUN npm install
# RUN npm run build --filter=@repo/db --filter=@repo/ui
WORKDIR /app/packages/db
RUN npx prisma generate

WORKDIR /app/apps/user
RUN npm run build

EXPOSE 3000


CMD ["npm", "start"]