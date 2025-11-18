# Use latest Node 20 lightweight Alpine image
FROM node:20-alpine

# Create app directory
RUN mkdir -p /usr/src/node-app

# Set working directory
WORKDIR /usr/src/node-app

# Switch to non-root user
USER node

# Copy package.json and package-lock.json (if exists), set ownership
COPY --chown=node:node package.json package-lock.json* ./

# Install dependencies using npm
RUN npm install

# Copy rest of the application code, set ownership
COPY --chown=node:node . .

# Expose the port your app runs on
EXPOSE 3000

# Ensure Express listens on the Railway-assigned PORT
# Make sure your src/index.js uses: const PORT = process.env.PORT || 3000;
CMD ["node", "src/index.js"]
