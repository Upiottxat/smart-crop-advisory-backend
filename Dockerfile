# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR .

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Start the server
CMD ["pnpm", "start"]