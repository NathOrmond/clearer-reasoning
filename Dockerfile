# Step 1: Specify the base image with a compatible Node.js version
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application
COPY . .

# Step 6: Build the application
RUN npm run build

# Step 7: Expose the port
EXPOSE 3000

# Step 8: Define the command to run the application
CMD [ "npm", "run", "start" ]