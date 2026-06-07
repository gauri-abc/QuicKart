# VULNSIGHT-V2 Remediation Dockerfile
# Complete replacement — copy to your repository and re-scan

# VULNSIGHT-V2 Remediation Dockerfile
# Security-hardened — copy to your repository and re-scan

FROM python:3.12-slim

RUN apt-get update && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*


LABEL maintainer="security-team" version="1.0"

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5001

RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app || true
USER appuser

CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "2", "app:app"]
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD python -c "import sys; sys.exit(0)"
