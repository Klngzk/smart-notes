FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

RUN npm run build
# Build React app (or use `npm run dev` for development)
CMD ["npm", "run", "dev", "--", "--host"]
