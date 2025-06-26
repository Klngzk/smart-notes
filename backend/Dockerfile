# Use the official Node.js LTS image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 5000

# Start the server using ts-node-dev
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]
# CMD ["npx", "prisma", "migrate","deploy","&&","npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]
