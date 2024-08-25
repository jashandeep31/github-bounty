FROM node:22  AS base

WORKDIR /app


COPY . .
RUN rm -rf /app/apps/user
RUN rm -rf /app/apps/maintainer
RUN npm install


WORKDIR /app/packages/db
RUN npx prisma generate



WORKDIR /app/apps/backend
FROM node:22-slim 
COPY --from=base /app .

EXPOSE 8000

CMD ["npm", "start" ]