A search model (embedding) finds passages by meaning. A result sorter (rerank) puts the best ones first. Workbench's saved documents and Open WebUI's document search use them.

1. Open **Library** or **Discover**. The **Search models** shelf offers three: **Qwen3-Embedding-0.6B** (start here), **nomic-embed-text-v1.5** (lighter) and **Qwen3-Reranker-0.6B** (sorts results).
2. Choose **Find it in Discover** or **See its files**, and download it.
3. On the model's page, press **Run**. The line under it, **Runs as: search model (found in the file)**, says what Eugene will start.
4. Run the sorter the same way.
5. Apps reach them at Eugene's address: `/v1/embeddings`, and `/v1/rerank`, which takes Jina, Cohere and TEI requests. To use them from Open WebUI or your own code, see [Set up RAG with Eugene](/guides/set-up-rag).

<details>
<summary>Open WebUI</summary>

Installed from **Apps**, Open WebUI uses them by itself. At its first start, Eugene points its document search at the first local search model and sorter it can reach, and turns on hybrid search. After that, Open WebUI's own **Admin Settings → Documents** decides.

</details>

<details>
<summary>Workbench's sorter</summary>

In the console, select Workbench, then **Settings → Documents**: **Result sorter for My documents** and **Sort time**. The default Sort time, 3 s, suits a GPU, where a question takes about 0.6 s. On a typical CPU a question takes about 7 s, so raise it there.

</details>

<details>
<summary>If Eugene starts it as the wrong kind</summary>

For a llama.cpp model, open **Launch profiles**, **edit** the profile, and set **Runs as** to Auto, Chat, Search or Sort results. Then **save**.

</details>
