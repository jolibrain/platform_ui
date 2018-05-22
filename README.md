# Core-UI

Web interface to control DeepDetect processus.

## Dependencies

```bash
yarn install
```

## Build

```
yarn start
```

## Usage

Open your browser on [http://localhost:3000](http://localhost:3000)

## Deploy with nginx

1. Edit react app server IP and port in ```.nginx.conf```
2. Edit deepdetect server IP and port in ```.nginx.conf```
3. Copy nginx config file in ```site-enabled``` :

```
sudo cp .nginx.conf /etc/nginx/site-enabled/
```

4. Reload ```nginx``` server :

```
sudo /etc/init.d/nginx reload
```
