# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 8000, so expose it
EXPOSE 8000

# Command to run the app in development mode
# ts-node will watch for changes if configured in tsconfig.json or via nodemon
CMD ["npm", "run", "dev"]
