FROM node:22  AS base

WORKDIR /app



COPY package.json ./
COPY package-lock.json ./
COPY apps/backend/package*.json ./
COPY packages/db/package*.json ./

RUN npm install

COPY . .
RUN rm -rf /app/apps/user
RUN rm -rf /app/apps/maintainer


WORKDIR /app/packages/db
RUN npx prisma generate



WORKDIR /app/apps/backend
FROM node:22-slim 
COPY --from=base /app .

EXPOSE 8000

CMD ["npm", "start" ]