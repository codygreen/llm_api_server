FROM alpine as cloner

RUN apk add git-lfs
RUN git lfs install
RUN git clone https://huggingface.co/Falconsai/text_summarization /tmp/model/text_summarization

FROM unit:python

WORKDIR /code/app

COPY requirements.txt app/api.py .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY --from=cloner /tmp/model /code/app/model
RUN chown -R unit:unit .

COPY unitconf.json /docker-entrypoint.d/
