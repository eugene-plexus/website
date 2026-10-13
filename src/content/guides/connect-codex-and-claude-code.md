1. In the console's Home page, find **Use it from your apps**.
2. Under **Key permissions and limits**, fill in **What is it for?**, for example "Codex on the laptop", and press **Make a key**. Copy it now: it is shown once and not stored.
3. Choose the model, then press **Codex** or **Claude Code** under **Set up**.
4. Put what it shows in place:
   - **Codex:** the block goes in `~/.codex/config.toml`, and the key in the `EUGENE_API_KEY` environment variable, set where you start Codex. Never put the key in the file.
   - **Claude Code:** set the environment variables it lists: `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`, and, when the model's window is known, its window and reply limit.
5. Start Codex or Claude Code as usual.

<details>
<summary>Good to know</summary>

- Choose a model that calls tools well. Protocol support does not make a small model a dependable coding agent.
- Claude Code's address has no `/v1`; Codex's keeps it. The console writes both correctly.
- A setting the model ignores is named in the `x-eugene-plexus-ignored-settings` response header.
- A Claude Code turn reserves its whole answer allowance (32,000 tokens), so a llama.cpp server with a 64k-token pool runs one Claude Code turn at a time. The others wait; they do not fail.
- Open WebUI, Continue, Cline and other apps have their own buttons under **Set up**.

</details>
