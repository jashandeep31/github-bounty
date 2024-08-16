FROM node:22 AS base1

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/user/package*.json ./
RUN npm install
COPY . .
RUN rm -rf /app/apps/backend
RUN rm -rf /app/apps/maintainer

WORKDIR /app/packages/db
RUN npx prisma generate
# FROM node:22-slim 
# COPY --from=base1 /app .


WORKDIR /app/apps/user
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]