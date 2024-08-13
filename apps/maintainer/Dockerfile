FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/maintainer/package*.json ./

# Install dependencies for the maintainer app
RUN npm install

# Copy the entire maintainer app into the working directory
COPY . .
RUN npm run build

# Expose the port that the maintainer app will run on
EXPOSE 8000
WORKDIR /app/apps/maintainer
RUN npm run build



CMD ["npm", "start"]