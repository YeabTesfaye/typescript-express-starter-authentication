FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=development
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app

# Clean npm cache
RUN npm cache clean --force

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
