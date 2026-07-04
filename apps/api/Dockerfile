FROM python:3.12-slim

WORKDIR /srv/exobod

COPY apps/api/requirements.txt apps/api/requirements.txt
RUN pip install --no-cache-dir -r apps/api/requirements.txt

COPY packages/core packages/core
COPY apps/api apps/api

WORKDIR /srv/exobod/apps/api
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
