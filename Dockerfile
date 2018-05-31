# base image
FROM node:10.1.0

# install and config nginx
RUN apt-get update
RUN apt-get install -y nginx
COPY .nginx.conf /etc/nginx/conf.d/deepdetect.conf
RUN /etc/init.d/nginx start

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
#RUN npm install --silent
#RUN npm install react-scripts@1.1.1 -g --silent
RUN npm install
RUN npm install react-scripts@1.1.1 -g

# start app
CMD ["npm", "start"]
