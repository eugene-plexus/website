## Ask about one file

Press **Attach** beside the message box, or drop or paste a file: a PDF, Word (.docx), Markdown, text, CSV, HTML or code file. Any model answers from it. **Sources** under the answer lists the **Files sent to the model**, with their pages and size in tokens.

A long file asks you to **Choose how much to read**: **Read it all**, **Read the first** part, or **Search it instead**. Each button says how many tokens it sends. A file is read whole without asking up to 6,000 tokens, or a quarter of the model's window if that is less.

## Keep documents to search

1. Open **Documents**. Under **Add files**, press **Choose files**, or drop files there.
2. In a chat, press the **Documents** chip at the top and switch on **Documents in this chat**. New chats start with it off. To change that, switch on **Documents in new chats** under **Settings** on **Documents**.
3. Ask. **Sources** lists each passage sent, by file, pages and heading, and marks the ones the answer used as **Cited**.

To keep answers to what your documents say, switch on **Documents only** in the same place. If nothing matches, Workbench says so itself and offers **Ask the model anyway**.

Each document has **Open original**, **Show indexed text**, **Re-read** and **Remove**. Adding a file with the same name replaces the older one.

## Search by meaning

Without a search model, Workbench finds passages by their words, spelled the same: "costs" does not find "cost". With one running, it searches by meaning and by words. To run one, see [Run a local embedding model and reranker](/guides/run-search-models). Workbench uses the first local search model it finds. If the search model changes, **Documents** offers **Rebuild search**.

A result sorter puts the best passages first. Its **Sort time** is 3 s by default, which suits a GPU, where a question takes about 0.6 s. On a typical CPU a question takes about 7 s, so Workbench skips the sort and says why. To sort there anyway, raise **Sort time** in Workbench's settings in Eugene's console.

To see what a question finds, use **Test a question** on **Documents**.

## Add a folder

The owner first grants you the folder: see [Add MCP tools and folders to Workbench](/guides/workbench-tools#grant-a-folder). Then:

1. Open **Documents** and go to **Folders**, then **Add a folder**.
2. Pick the **Folder to add**. To skip some files, open **Choose what to leave out first**.
3. Press **Add folder**.

Workbench reads the folder's files as your documents and never changes anything in it. It checks the folder every 10 minutes by default, and when you press **Sync now**.

<details>
<summary>Good to know</summary>

- A file can be up to 50 MiB, and Workbench keeps up to 100,000 passages for you.
- It skips scanned PDFs (it cannot read text in pictures), PowerPoint, Excel, EPUB and RTF files, and files a cloud-sync program keeps online only.
- A folder can hold up to 10,000 files and 2,048 MB. Only folders on the machine Workbench runs on can be added, not Job Site folders yet.
- By default, passages are not sent to models outside your machines: the chat offers **Send for this chat**. Files you attach are always sent.
- Folders need a Windows service install or a Linux system install, and on Linux, Landlock ABI 3 or later. They do not work on macOS.

</details>
