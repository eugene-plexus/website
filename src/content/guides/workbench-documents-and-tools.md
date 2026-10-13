## Ask about a file

Press **Attach** in the composer, or drop or paste a file: a PDF, Word file, Markdown, text, CSV, HTML or code. Any model answers from it, and the answer names the file. A long file offers **Read it all**, **Read the first** part, or **Search it instead**.

## Keep documents to search

1. Open **Documents** and press **Add files**.
2. In a chat, the **Documents** chip turns them on. **Documents only** keeps answers to what they say.

Answers cite each passage by file and page. Searching by meaning needs a search model: see [Run a search model and a result sorter](/guides/run-search-models).

## Grant a folder

The owner grants a folder to one person:

1. Open **Toolbox · Tools → Folders · File tools → Grant an existing folder**.
2. Fill in **Folder name**, **Full folder path on Workbench's host** and **Person who can use it**. Tick **Allow creating and editing text files** only if they need it.
3. Press **Grant folder access**.
4. The person adds it to their documents: **Documents → Folders → Add a folder**, then **Add folder**. It stays in step as its files change.

## Add a tool server

- **Toolbox · Tools → Add a shared network server**: a **Name**, the **MCP address**, and a **Bearer credential** if it needs one. Press **Add server**.
- The owner can add a program on Workbench's machine: **Add a local server (owner only)**, with its **Full executable path** and **Arguments (JSON array)**. Press **Save local server**.

## Use tools in a chat

1. Open the chat's gear, **This chat's settings**, tick the servers and folders, and press **Save settings**.
2. Each call waits for you: **Approve call** or **Decline**.

## Memory

Start a message with "Remember that…" and Workbench keeps that sentence as a note, with **Undo** right there. The **Memory** page lists every note, with **Export as Markdown**, **Export as JSON** and **Delete all memory**. A cloud model gets no notes unless you send them for that chat.

<details>
<summary>Good to know</summary>

- Local servers and folders need a Windows service or a Linux system install. On Linux, folder tools need Landlock ABI 3 or later.
- MCP sign-in (OAuth), resources and prompts are not supported yet.
- Tools on another of your computers: [set up a Job Site](/guides/set-up-a-job-site).

</details>
