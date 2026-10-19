Another app that speaks MCP, such as Claude Code, Codex or Open WebUI, can search your notes and documents in Workbench, and suggest notes, through a connection you make, limit and revoke.

1. In Workbench, open **Memory** and find **Connections to other apps**. Press **Make a connection**.
2. Under **Name it after the app and the machine**, type a name, for example "Claude Code on my laptop".
3. Under **What it may do**, tick what the app is allowed: **Reads your notes**, **Searches your documents**, **Suggests notes to your inbox**. Suggesting is off until you tick it. With all three ticked the app gets four tools; with only notes ticked it gets `search_notes` alone.
4. Under **Works for**, choose 30, 90 or 365 days. Read the warning, then press **Make connection**.
5. Copy the token now. Workbench shows it once and keeps only a fingerprint. Then set up the app:
   - **Claude Code:** press **Copy the command** and run it in a terminal. It is `claude mcp add --transport http workbench` with Workbench's address and an `Authorization: Bearer` header holding the token.
   - **Codex, Open WebUI and other apps:** use the block under **Apps that read an MCP settings file** in the app's MCP settings, or enter the **Address** and the `Authorization: Bearer` header it shows by hand.
6. Press **I have copied it**.

The connection's row shows its rights, when it works until, when it was last used and its calls today.

## Suggestions and revoking

A note an app suggests waits under **Suggested notes** on **Memory**, marked "Suggested by" and the connection's name. Press **Keep**, **Edit** or **Dismiss**. Nothing reaches a model until you keep it.

To stop an app, press **Revoke** on its connection, then **Revoke** again. The app stops at once, and the suggestions it made that you have not kept go with it. If you lose a token, revoke the connection and make a new one.

<details>
<summary>Good to know</summary>

- A connection reads only your notes and documents, and works only while you are signed in to Workbench, on any device. When your sign-in ends, it stops.
- The app may send what it reads to the model it uses, and that model can run outside your machines. Claude Code sends it to Anthropic.
- You can have 10 connections. Each allows 60 calls a minute and 4 at once.
- The owner cannot see your connections or your notes, and cannot revoke your connections.
- To turn every connection off, the owner selects Workbench in the console, then **Settings → Memory**, and switches off **People may connect other apps to their notes and documents**. Each person then sees a notice on **Memory**, and no one can make a connection.

</details>
