# Use Node.js image for build 
FROM node:alpine

# Set working directory
WORKDIR /app

# Accept build arguments
ARG API_URL
ENV API_URL=$API_URL

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]