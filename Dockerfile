# Use the official Node.js 18 image as a base image
FROM node:18-alpine

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Compile TypeScript to JavaScript
RUN tsc

# Expose the port the app runs on
EXPOSE 8080
# cd ..
# Start the application
CMD ["node", "dist/server.js"]
