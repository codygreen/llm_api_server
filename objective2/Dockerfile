FROM alpine as cloner

RUN apk add git-lfs
RUN git lfs install
RUN git clone https://huggingface.co/Falconsai/text_summarization /tmp/model/text_summarization

FROM quay.io/jupyter/pytorch-notebook
COPY --from=cloner /tmp/model /home/jovyan/model
