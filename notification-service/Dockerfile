# VULNSIGHT-V2 Remediation Dockerfile
# Security-hardened — copy to your repository and re-scan

# Pin base image with a digest, e.g. FROM python:3.12-slim-bookworm@sha256:<digest>
FROM python:3.12-slim

LABEL maintainer="security-team" version="1.0"

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5004

RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app || true
USER appuser

CMD ["gunicorn", "--bind", "0.0.0.0:5004", "--workers", "2", "app:app"]
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD python -c "import sys; sys.exit(0)"
