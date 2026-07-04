FROM python:3.12-slim
WORKDIR /srv/core
RUN pip install --no-cache-dir "pyzmq>=25"
COPY packages/core .
EXPOSE 5555
CMD ["python", "reflex/reflex_sim.py"]
