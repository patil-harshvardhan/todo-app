# Dockerfile for Express API server
FROM node

USER root

#copy everything in the current directory to the container except the files in .dockerignore
COPY . .

#install dependencies
RUN npm install

#expose port 8000
EXPOSE 8000

#run the server
CMD ["node", "server.js"]