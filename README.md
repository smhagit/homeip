# HomeIP

![Docker Image CI](https://github.com/smhagit/homeip/actions/workflows/docker-image.yml/badge.svg?branch=master)

This is a small alpine based nodejs container which will gather your public IP from a cloud service. This IP is then used to update a DNS record via Hetzner DNS API 


## Usage

**Attention: This only works with Hetzner DNS Api.

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
```
