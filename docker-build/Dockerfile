FROM node:10.1.0

WORKDIR /opt/code

RUN npm install -g npm-run-all yarnpkg

EXPOSE 3000
CMD ["npm", "install", "--production"]
CMD ["yarn", "install", "--production"]
CMD ["yarn", "build"]