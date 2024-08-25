FROM node:22 AS base2


WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/maintainer/package*.json ./
COPY apps/db/package*.json ./
COPY apps/ui/package*.json ./
RUN npm install

COPY . .
RUN rm -rf /app/apps/user
RUN rm -rf /app/apps/backend
RUN npm install

WORKDIR /app/packages/db
RUN npx prisma generate

WORKDIR /app/apps/maintainer
RUN npm run build


FROM node:22-slim 
COPY --from=base2 /app .

WORKDIR /app/apps/maintainer
EXPOSE 3001
CMD ["npm", "start"]