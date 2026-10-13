A cloud account or subscription sits beside your own models, behind the same address, with the same keys and routing.

1. Open **Backends** and choose **Add an external backend**. On Home, **Add an existing app or subscription** goes to the same place.
2. Under **Which app?**, choose one:
   - **Google Gemini API**, **OpenAI API**, **OpenRouter**, **xAI (Grok)** or **MiniMax**: paste the **API key** the provider gave you. Make a Gemini key in Google AI Studio, at aistudio.google.com/apikey.
   - **Claude (Pro/Max subscription via Claude Code CLI)** or **ChatGPT (subscription via Codex CLI)**: install that program on the machine and sign in to it first. Eugene uses its sign-in.
   - **Local — Ollama** or **Local — LM Studio**: the address and key are optional.
   - **Any OpenAI-compatible server, by its URL**: its **Address** and **API key**.
3. Press **Add**.
4. Under **Which models?**, keep **Every model it lists**, or pick **One model**, and press **Save**. A subscription asks **Which model?** instead.
5. Try it in the **Playground**, or from any app on Eugene's address.

<details>
<summary>Good to know</summary>

- A key marked local-only never falls back to a cloud provider.
- A subscription answers as a model only. It runs no tools or shell commands on the machine hosting it.
- A model is offered tools unless the provider has shown it cannot use them, and a setting it ignores is named in the `x-eugene-plexus-ignored-settings` response header.
- Messages sent to a cloud provider go to that provider, and it bills you as it normally would.

</details>

Want models to search the web too? [Add a web search account](/guides/add-web-search).
