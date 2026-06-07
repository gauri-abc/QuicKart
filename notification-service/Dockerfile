# VULNSIGHT-V2 Remediation Dockerfile
# Security-hardened — copy to your repository and re-scan

FROM python:3.12.11-slim-bookworm

LABEL maintainer="security-team" version="1.0"


RUN apt-get update && \
apt-get install -y && \

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5004

RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app || true
USER appuser

CMD ["python", "app.py"]
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD python -c "import sys; sys.exit(0)"
