# Stage 1: Build the React app
FROM node:18-alpine as build

# Set work directory
WORKDIR /app

# Clear node cache
RUN npm cache clean --force

# Update node version
RUN npm install -g npm@9.8.1

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install peer dependencies
RUN npm install --legacy-peer-deps

# Install dependencies
RUN npm install --force

# Copy the rest of the app's source code
COPY . .

# Run the build process
RUN npm run build

# Stage 2: Setup Nginx to serve the static files
FROM nginx:1.21.0-alpine

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Remove default Nginx configurations
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx is listening on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
