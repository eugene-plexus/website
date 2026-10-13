Your install runs web search itself, for every app and every model that calls tools. Only the search terms reach the search service.

1. Open **Backends**, and in the side tree choose **Add a search account**.
2. Under **Search with**, pick one:
   - **Brave Search**: paste your **Brave Search API key**.
   - **Google Search (Gemini API key)**: paste a **Gemini API key** from Google AI Studio, at aistudio.google.com/apikey.
   - **SearXNG**: enter your **SearXNG address**.
3. Press **Add**, then **Try a search in the playground**.
4. With more than one account, set the order: **Routing → Web search order**, then **Move up** or **Move down**, and **Save order**. **Use the default order** tries free accounts first, then this machine's.

Models can now search from Workbench, and from apps such as Claude Code and Codex.

<details>
<summary>Good to know</summary>

- Workbench shows each source's site, and Google's Search Suggestions, unmodified, when Google searched.
- Searches from Codex and other Responses API clients honour a blocked-domains list, and options Eugene does not run are named.
- Brave's rate-limit headers are read as Brave documents them, but have not been seen from a live account yet.

</details>
