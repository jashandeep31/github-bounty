FROM node:22

WORKDIR /app

COPY . .
RUN rm -rf /app/apps/backend
RUN rm -rf /app/apps/maintainer
RUN npm install

WORKDIR /app/packages/db
RUN npx prisma generate


WORKDIR /app/apps/user
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]