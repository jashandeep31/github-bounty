FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/backend/package*.json ./

COPY . .


RUN rm -rf /app/apps/user
RUN rm -rf /app/apps/maintainer

RUN npm install

WORKDIR /app/packages/db
RUN npx prisma generate


WORKDIR /app/apps/backend
EXPOSE 8000



# Run the backend app using npx tsx
CMD ["npx", "tsx", "src/index.ts"  ]