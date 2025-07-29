# STEP 1: Use the official Node.js image
FROM node:18-alpine

# STEP 2: Set the working directory inside the container
WORKDIR /app

# STEP 3: Copy package.json and package-lock.json (for dependency caching)
COPY package*.json ./

# STEP 4: Install dependencies
RUN npm install

# STEP 5: Copy the rest of the application code
COPY . .

# STEP 6: Build the TypeScript code
RUN npm run build

# STEP 7: Expose the application port (adjust if different)
EXPOSE 3000

# STEP 8: Start the application
CMD ["npm", "run", "start:prod"]
