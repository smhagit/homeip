# HomeIP
![Docker Image CI](https://github.com/smhagit/homeip/actions/workflows/docker-image.yml/badge.svg?branch=master)

This is a small alpine based nodejs container which will gather your public IP from a cloud service. This is used to update a DNS record via Hetzner DNS API to point to your public IP.

# Platform: ARM
As this Docker Image is primary used on my Raspberries, the base image is `arm32v7/node:lts-alpine3.10`.

# Docker 
`docker pull smhagit/homeip`

This image is built with GitHub Actions via self-hosted runner on an arm64 Raspberry Pi.

## Usage
**Attention**: This only works with Hetzner DNS API.

`docker-compose.yml`  
```yaml
version: "3.9"
services:
    app:
        image: smhagit/homeip
        environment:
            HETZNER_RECORD_ID: xxx
            HETZNER_ZONE_ID: xxx
            HETZNER_RECORD_NAME: home # xxx.domain.tld
            HETZNER_API_TOKEN: xxx
            INTERVAL: 5400
```
