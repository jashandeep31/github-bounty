FROM node:22 AS base


WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/maintainer/package*.json ./
RUN npm install
COPY . .
# RUN npm run build --filter=@repo/db --filter=@repo/ui
RUN rm -rf /app/apps/backend
RUN rm -rf /app/apps/user

WORKDIR /app/packages/db
RUN npx prisma generate

WORKDIR /app/apps/maintainer
RUN npm run build

FROM node:22-slim 
COPY --from=base /app .

WORKDIR /app/apps/maintainer
EXPOSE 3001
CMD ["npm", "start"]