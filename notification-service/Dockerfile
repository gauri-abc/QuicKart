FROM python:3.12-slim

USER root

RUN apt-get update && \
    apt-get install -y telnet ftp && \
    chmod 777 /

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5004

CMD ["bash"]
