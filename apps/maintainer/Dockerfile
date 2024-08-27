FROM node:22 


WORKDIR /app


COPY . .
RUN rm -rf /app/apps/user
RUN rm -rf /app/apps/backend
RUN npm install

WORKDIR /app/packages/db
RUN npx prisma generate

WORKDIR /app/apps/maintainer
RUN npm run build


EXPOSE 3001
CMD ["npm", "start"]