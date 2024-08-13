FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./


COPY apps/user/package*.json ./

# Install dependencies for the user app
RUN npm install

# Copy the entire user app into the working directory
COPY . .
RUN npm run build

# Expose the port that the user app will run on
EXPOSE 8000
WORKDIR /app/apps/user
RUN npm run build



CMD ["npm", "start"]