# Use the official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app code
COPY . .

# Build the app (if using Next.js/TypeScript)
RUN npm run build

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the application
CMD ["npm", "start"]