# VULNSIGHT-V2 Remediation Dockerfile
# Complete replacement — copy to your repository and re-scan

FROM nginx:1.27.2-alpine

RUN apk update && apk upgrade --no-cache


COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html products.html cart.html checkout.html success.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
USER appuser
