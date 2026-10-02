**Eugene Plexus** is an open-source, self-hosted **control plane for local LLM inference** — in other words, the management layer that sits around your local AI model setup rather than doing the inference itself. It's currently under active development, with an alpha version available for early testing via versioned installers and a matching container image.

**What it does** (from its [project site](https://eugeneplexus.com/)):
- Installs and supervises upstream inference engines (the actual model-running software)
- Manages model files and launch settings
- Routes requests, exposing an **OpenAI-compatible API** (chat, tool calling, embeddings) plus **Anthropic Messages** compatibility for text and tool calls

**How it's organized** — it's a multi-component system with [shared OpenAPI 3.1 contracts](https://github.com/eugene-plexus/specs) (components share schemas, not code):
- **agent** — a per-host node agent that supervises the other components and inference engines, manages engine binaries, and handles node enrollment
- **control** — the install-wide trust root, node registry, topology, and a replicated control-state log
- **gateway** — serves the OpenAI/Anthropic-compatible API
- **inference-driver** and **library** — handle engine execution and model files
- **ui** — a [web dashboard](https://github.com/eugene-plexus/ui) with runtime monitoring, a model library with discovery/downloads, schema-driven configuration, a chat playground, and logs

There's also **Workbench**, its own [chat app](https://github.com/eugene-plexus/workbench) for chatting with the models an Eugene install serves (with web search), signed in through Eugene.

The name plays on "plexus" (a network of interconnected elements, as in a nerve plexus) — it's the networked control layer tying together your local inference machines.
