1. In the console, open **Apps**. Workbench is under **Available**.
2. With more than one machine, choose where it runs under **install on**. Press **Install**.
3. When it says **Installed.**, press **Open ↗**.
4. Press **Sign in with Eugene**. The owner signs in with Eugene's passphrase; once other people are added, the owner's name is `operator`.
5. To add someone, open **People → Add a person** in the console. Give a **Name they sign in with**, a **First password**, and tick Workbench under **Apps they may sign in to**. Press **Add**.

Next: [give Workbench documents, folders and tools](/guides/workbench-documents-and-tools).

<details>
<summary>On a NAS container</summary>

Install it under **Apps** on the container's machine. To reach Workbench and the console through one HTTPS port, each at its own name, see [Serve the container on one HTTPS port](/guides/container-https). Otherwise publish Workbench's own port, which **Apps** shows.

</details>

<details>
<summary>Good to know</summary>

- On a Windows service or a Linux system install, Workbench runs in an operating-system account of its own, with no access to Eugene's keys.
- Each person's chats, notes and documents are their own.

</details>
