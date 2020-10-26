FROM node:12.18.3 as builder
ADD . /app
WORKDIR /app
RUN yarn install
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
