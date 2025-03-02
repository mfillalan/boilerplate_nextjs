FROM node:18-alpine

WORKDIR /app

# Install dependencies only when needed
COPY ./app/package*.json ./
RUN npm install

# Set environment variables
ENV NODE_ENV=development
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV NEXT_WEBPACK_USEPOLLING=1

# Command to run the app
CMD ["npm", "run", "dev"]
