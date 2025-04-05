FROM node:20.11.1-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose the correct port
EXPOSE 80

# Start the app in development mode with hot reloading
CMD ["npm", "run", "dev", "--", "--host"]
