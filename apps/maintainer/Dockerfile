FROM node:22 AS base2


WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/maintainer/package*.json ./
COPY packages/db/package*.json ./
COPY packages/ui/package*.json ./
RUN npm install
COPY . .
RUN rm -rf /app/apps/backend
RUN rm -rf /app/apps/user

WORKDIR /app/packages/db
RUN npx prisma generate


# FROM node:22-slim 
# COPY --from=base2 /app .

WORKDIR /app/apps/maintainer
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]