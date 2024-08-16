FROM node:22 AS base

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/backend/package*.json ./
COPY . .
RUN npm install
RUN rm -rf /app/apps/user
RUN rm -rf /app/apps/maintainer

WORKDIR /app/packages/db
RUN npx prisma generate

WORKDIR /app/apps/backend
EXPOSE 8000



# Run the backend app using npx tsx
CMD ["npx", "tsx", "src/index.ts"  ]s