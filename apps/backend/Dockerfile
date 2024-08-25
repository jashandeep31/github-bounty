FROM node:22 

WORKDIR /app


COPY . .
RUN rm -rf /app/apps/user
RUN rm -rf /app/apps/maintainer
RUN npm install


WORKDIR /app/packages/db
RUN npx prisma generate



WORKDIR /app/apps/backend
EXPOSE 8000

CMD ["npx", "tsx", "src/index.ts" ]