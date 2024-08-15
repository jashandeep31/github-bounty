FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/backend/package*.json ./

# Install dependencies for the backend app
COPY . .

RUN npm install
# Copy the entire backend app into the working directory

WORKDIR /app/packages/db
RUN npx prisma generate
# Expose the port that the backend app will run on
WORKDIR /app/apps/backend
EXPOSE 8000



# Run the backend app using npx tsx
CMD ["npx", "tsx", "src/index.ts"  ]