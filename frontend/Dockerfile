# frontend/Dockerfile

# --- Stage 1: Build the React application ---
    FROM node:20-alpine AS build

    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json (or yarn.lock)
    COPY package.json ./
    COPY package-lock.json ./
    # If using yarn, uncomment the next line and comment out the package-lock.json line
    # COPY yarn.lock ./
    
    # Install dependencies
    RUN npm install
    # If using yarn, uncomment the next line and comment out the npm install line
    # RUN yarn install
    
    # Copy the rest of the application code
    COPY . .
    
    # Define an argument for the API base URL, which can be passed during the build
    ARG VITE_API_BASE_URL
    # Set the environment variable for Vite to use during the build
    ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
    
    # Build the application for production
    RUN npm run build
    # If using yarn, uncomment the next line and comment out the npm run build line
    # RUN yarn build
    
    # --- Stage 2: Serve the static files with Nginx ---
    FROM nginx:stable-alpine
    
    # Remove default Nginx configuration
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Copy the custom Nginx configuration file (created separately)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy the built static files from the 'build' stage to Nginx's web root directory
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Expose port 80 (Nginx default HTTP port)
    EXPOSE 80
    
    # Command to start Nginx in the foreground
    CMD ["nginx", "-g", "daemon off;"]
    