FROM python:3.11 as builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    git-lfs \
    && git lfs install \
    && git clone https://huggingface.co/Falconsai/text_summarization /tmp/model/text_summarization \
    && rm -rf /tmp/model/.git \
    && rm -rf /var/lib/apt/lists/*

FROM quay.io/jupyter/pytorch-notebook

COPY --from=builder /tmp/model /home/jovyan/model