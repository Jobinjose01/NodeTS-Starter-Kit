FROM node:22

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN rm -rf node_modules
RUN npm install

# Create the logs directory and set permissions
RUN mkdir -p /usr/src/app/logs && chmod -R 777 /usr/src/app/logs

# Copy all source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the application port
EXPOSE ${PORT}

COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

# Use nodemon for auto-reloading
CMD ["npm", "run", "dev"]
