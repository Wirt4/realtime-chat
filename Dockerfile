# Use the official Node.js image as the base
FROM node:18.17.0-alpine

# Install necessary packages
RUN apk add --no-cache libc6-compat

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install SWC binaries for linux/arm64
RUN npm install @next/swc-linux-arm64-gnu @next/swc-linux-arm64-musl

# Copy the app source code to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
