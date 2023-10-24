FROM node:18.18.2 as builder
ADD . /app
WORKDIR /app
RUN yarn install
RUN yarn build
RUN git describe --tags --dirty > /version

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /version /usr/share/nginx/html/version
