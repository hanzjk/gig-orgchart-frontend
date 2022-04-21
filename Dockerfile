# build environment
FROM node:14.19.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
COPY . /app

# set baseurl to get connected with backend API
# ENV REACT_APP_API_BASE_URL=http://localhost:8000
ARG SERVER_URL=http://localhost:9000/
ARG PUBLIC_URL=http://localhost:9000/

ENV REACT_APP_SERVER_URL=$SERVER_URL
ENV REACT_APP_PUBLIC_URL=$PUBLIC_URL

RUN npm run build --if-present

# host environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]