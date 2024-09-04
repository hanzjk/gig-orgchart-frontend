# build environment
FROM node:14.19.0-alpine3.15 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
COPY . /app

# set baseurl to get connected with backend API
ARG SERVER_URL=http://localhost:9000/
ARG PUBLIC_URL=http://localhost:9000/

ENV REACT_APP_SERVER_URL=$SERVER_URL
ENV REACT_APP_PUBLIC_URL=$PUBLIC_URL

RUN npm run build --if-present

# host environment
FROM nginx:1.25.1-alpine

# Update and upgrade Alpine packages
RUN apk update && apk upgrade

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Create a non-root user
RUN adduser -D -u 10014 choreouser

# Change ownership of the nginx html directory
RUN chown -R choreouser:choreouser /usr/share/nginx/html

# Modify Nginx configuration to use port 8080
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/nginx.conf

# Switch to the non-root user
USER 10014

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]