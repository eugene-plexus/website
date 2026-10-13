RAG answers a question from your own documents. A search model finds passages that match, a result sorter puts the best first, and a chat model answers from them. Eugene runs all three on your machines.

Start by running a search model and a result sorter: see [Run a search model and a result sorter](/guides/run-search-models).

## In Workbench

There is nothing to connect. Add your documents and ask: see [Ask Workbench about your documents](/guides/workbench-documents).

## In Open WebUI

Installed from **Apps**, Open WebUI is set up for you. At its first start, Eugene points its document search at the first local search model and sorter, and turns on hybrid search. If none was running then, choose them in Open WebUI's **Admin Settings → Documents**.

If you run Open WebUI yourself, give it these settings before it starts. Use Eugene's address, ending in `/v1`, and a key made for it.

- `RAG_EMBEDDING_ENGINE=openai`, `RAG_OPENAI_API_BASE_URL` (the address), `RAG_OPENAI_API_KEY` (the key), `RAG_EMBEDDING_MODEL` (the search model's name)
- `RAG_RERANKING_ENGINE=external`, `RAG_EXTERNAL_RERANKER_URL` (the address, then `/rerank`), `RAG_EXTERNAL_RERANKER_API_KEY` (the key), `RAG_RERANKING_MODEL` (the sorter's name)
- `ENABLE_RAG_HYBRID_SEARCH=true`, `RAG_EMBEDDING_BATCH_SIZE=32`, `RAG_EMBEDDING_CONCURRENT_REQUESTS=1`

Always set `RAG_OPENAI_API_BASE_URL`. Without it, Open WebUI 0.11.4 sends your documents' text to api.openai.com.

## From your own code

1. On the console's Home page, find **Use it from your apps**. Copy the **Address**, and press **Make a key**. A key allows 2 requests at once and 60 a minute unless you set more under **Key permissions and limits**. Set more if you will add many files.
2. Find the model names. A search model lists `embeddings` in its `surfaces`, and a sorter lists `rerank`.
3. Turn passages and questions into vectors at `/embeddings`, and keep the passages' vectors in your own database.
4. Send the closest passages to `/rerank` with the question. Results come best first, each with its `index` and a `relevance_score` from 0 to 1.
5. Ask the chat model with the best passages in your message, at `/chat/completions`.

In Python, with the `requests` package:

```python
import math
import requests

EUGENE = "http://192.168.1.20:8080/v1"
KEY = "the key you made"
SEARCH = "Qwen3-Embedding-0.6B-Q8_0"
SORTER = "qwen3-reranker-0.6b-q8_0"
CHAT = "the model shown under Use it from your apps"
AUTH = {"Authorization": "Bearer " + KEY}

for model in requests.get(EUGENE + "/models", headers=AUTH).json()["data"]:
    print(model["id"], model["x_eugene_plexus"]["surfaces"])

def embed(texts):
    reply = requests.post(EUGENE + "/embeddings", headers=AUTH, json={"model": SEARCH, "input": texts})
    return [item["embedding"] for item in reply.json()["data"]]

def closeness(a, b):
    return sum(x * y for x, y in zip(a, b)) / (math.hypot(*a) * math.hypot(*b))

passages = [
    "The volunteer workday is the first Saturday of each month at 9 am.",
    "The compost bins are turned every Monday evening.",
]
question = "When is the volunteer workday?"

stored = embed(passages)
asked = embed(["Instruct: Given a question, retrieve passages that answer it\nQuery: " + question])[0]
closest = sorted(range(len(passages)), key=lambda i: closeness(asked, stored[i]), reverse=True)[:20]

sorted_reply = requests.post(EUGENE + "/rerank", headers=AUTH, json={
    "model": SORTER, "query": question, "documents": [passages[i] for i in closest], "top_n": 5})
best = [passages[closest[result["index"]]] for result in sorted_reply.json()["results"]]

prompt = "Answer from these passages only.\n\n" + "\n\n".join(best) + "\n\nQuestion: " + question
answer = requests.post(EUGENE + "/chat/completions", headers=AUTH, json={
    "model": CHAT, "messages": [{"role": "user", "content": prompt}]})
print(answer.json()["choices"][0]["message"]["content"])
```

The model names above are what **Run** names the three suggested files. Use the names your list prints.

<details>
<summary>Good to know</summary>

- Each passage gets 1,024 tokens by default. Split documents smaller, or raise the search model's context size in its launch profile.
- Send text, not token IDs. Eugene refuses token IDs. LangChain's `OpenAIEmbeddings` sends token IDs unless `check_embedding_ctx_length=False`.
- The Qwen3 search model wants the `Instruct:` line before each question, and nothing before passages. For nomic-embed-text, start questions with `search_query: ` and passages with `search_document: `.
- `dimensions` is ignored: vectors come back at the model's full size, 1,024 numbers for Qwen3-Embedding and 768 for nomic-embed-text.
- The sorter takes up to 1,000 passages in one request, and a question and one passage must fit in 1,024 tokens together. It accepts Cohere, Jina and TEI requests at `/v1/rerank`. There is no `/v2/rerank`.
- A request does not start a stopped search model or sorter: run it first.
- Tested with plain HTTP requests and with Open WebUI 0.11.4. LangChain, LlamaIndex and AnythingLLM have not been tested.
- Other apps cannot search Workbench's documents yet.

</details>
