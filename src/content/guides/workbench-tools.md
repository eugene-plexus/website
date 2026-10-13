Workbench can use folders the owner grants and MCP tool servers. Each call waits for your approval.

## Grant a folder

The owner grants a folder to one person:

1. Open **Toolbox · Tools → Folders · File tools → Grant an existing folder**.
2. Fill in **Folder name**, **Full folder path on Workbench's host** and **Person who can use it**. People appear after they sign in to Workbench once. Tick **Allow creating and editing text files** only if they need it.
3. Press **Grant folder access**.

To share a folder, grant it to each person separately. A person can also search the folder as documents: see [Ask Workbench about your documents](/guides/workbench-documents#add-a-folder).

## Add a tool server

- **Toolbox · Tools → Add a shared network server**: a **Name**, the **MCP address**, and a **Bearer credential** if it needs one. Press **Add server**.
- The owner can add a program on Workbench's machine: **Add a local server (owner only)**, with its **Full executable path** and **Arguments (JSON array)**. Press **Save local server**.

## Use tools in a chat

1. Open the chat's gear, **This chat's settings**, tick the servers and folders, and press **Save settings**.
2. Each call waits for you: **Approve call** or **Decline**.

<details>
<summary>Good to know</summary>

- Local servers and folders need a Windows service install or a Linux system install. On Linux, folder tools need Landlock ABI 3 or later.
- MCP sign-in (OAuth), resources and prompts are not supported yet.
- Tools on another of your computers: [set up a Job Site](/guides/set-up-a-job-site).

</details>
