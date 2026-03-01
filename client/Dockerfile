# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# The development server binds to port 5173
EXPOSE 5173

# Command to run the app
# The "-- --host" part is crucial for Vite to be accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
