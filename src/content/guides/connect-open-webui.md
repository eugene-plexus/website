Open WebUI is a chat interface by a separate project. Eugene installs it unmodified, signs people in to it, and points it at your models.

1. In the console, open **Apps**. Open WebUI is under **Available**.
2. With more than one machine, choose where it runs under **install on**. Press **Install**. It takes about 1.8 GB on disk and up to 2 GB of memory.
3. When it says **Installed.**, press **Open ↗**. Its first start can take a minute or more.
4. Sign in with Eugene on its sign-in page. The owner arrives as Open WebUI's admin, and everyone else as an ordinary user.
5. To let someone else in, open **People**, edit the person, and tick Open WebUI under **Apps they may sign in to**.
6. Start a chat. The models Eugene serves are in Open WebUI's model list.

## Document search

Open WebUI's document search uses Eugene's own search model and result sorter, so your documents' text stays on your machines. At Open WebUI's first start, Eugene points it at the first search model and sorter that are running and turns on hybrid search. If none was running then, choose them in Open WebUI's **Admin Settings → Documents**.

To run the models, see [Run a local embedding model and reranker](/guides/run-search-models). For the settings and a way to use them from your own code, see [Set up local RAG with Open WebUI or your own code](/guides/set-up-rag).

<details>
<summary>Good to know</summary>

- Eugene sets every outside address Open WebUI has: chat, document search, speech to text, text to speech, and image generation and editing all point at Eugene's gateway. Open WebUI 0.11.4 would otherwise send document text to api.openai.com. Version checks and analytics are off too.
- Open WebUI runs in an operating-system account of its own, with no access to Eugene's keys. A container that cannot make accounts for apps shows why and keeps **Install** disabled; install it on another machine.
- Its key is listed on **Home** under **Use it from your apps**. Turning it off there cuts Open WebUI off. A key allows 8 requests at once and 600 a minute; raise them with **Edit limits**.
- Open WebUI's own web search is off. It uses its own search keys, not the install's.
- Open WebUI's sign-in form is off. People sign in only through Eugene.

</details>
