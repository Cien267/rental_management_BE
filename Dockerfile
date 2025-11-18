# Use a lightweight Node.js image
FROM node:18-alpine

# Create app directory and set permissions
RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

# Set working directory
WORKDIR /usr/src/node-app

# Switch to non-root user
USER node

# Copy package.json and package-lock.json (if exists)
COPY package.json package-lock.json* ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code
COPY --chown=node:node . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "src/index.js"]
