FROM node:22 AS base1

WORKDIR /app


COPY package.json ./
COPY package-lock.json ./
COPY apps/user/package*.json ./
COPY packages/db/package*.json ./
COPY packages/ui/package*.json ./
RUN npm install


COPY . .
RUN rm -rf /app/apps/backend
RUN rm -rf /app/apps/maintainer
RUN npm install

WORKDIR /app/packages/db
RUN npx prisma generate

WORKDIR /app/apps/user
RUN npm run build


FROM node:22-slim 
COPY --from=base1 /app .


WORKDIR /app/apps/user

EXPOSE 3000
CMD ["npm", "start"]