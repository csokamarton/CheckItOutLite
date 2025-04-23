# Base image
FROM node:18-alpine

# Install PNPM
RUN npm install -g pnpm && apk add --no-cache curl

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start the application
CMD ["pnpm", "run", "dev"]