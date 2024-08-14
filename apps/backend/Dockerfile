FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/backend/package*.json ./

# Install dependencies for the backend app
COPY . .

RUN npm install
RUN  npm run build --filter=@repo/db --filter=@repo/queue
# Copy the entire backend app into the working directory

# Expose the port that the backend app will run on
EXPOSE 8000
WORKDIR /app/apps/backend
RUN npm run build



# Run the backend app using npx tsx
CMD ["npx", "tsx", "src/index.ts"]