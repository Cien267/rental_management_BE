# Use Node 20 Alpine (lightweight)
FROM node:20-alpine

# Create app directory
RUN mkdir -p /usr/src/node-app

# Set working directory
WORKDIR /usr/src/node-app

# Copy package.json and package-lock.json (if exists)
COPY package.json package-lock.json* ./

# Install dependencies as root to avoid permission issues
RUN npm install

# Copy rest of the application code
COPY . .

# Change ownership of app directory to node user
RUN chown -R node:node /usr/src/node-app

# Switch to non-root user for runtime
USER node

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "src/index.js"]
