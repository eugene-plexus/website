Speculative decoding lets a small predictor draft a few tokens ahead, and the model checks them in one step. The answer is still the model's own, and it comes faster when most drafts are kept. It works with llama.cpp.

1. Open **Library** and select a model. A **drafting** row reads its own MTP prediction head when the model's file carries one. An **MTP head** or **draft model** row, with a path, appears for each companion file found in the same folder. With neither, the model has nothing to draft with.
2. For a companion you do not have, open the model in **Discover**. Tick **Also get the drafting part, for faster answers** before you download. If you already own the model, press **Get it beside your** and the version, and the companion downloads alone into that model's folder.
3. On the model's page, open **Launch profiles**, **edit** the profile, and set **Draft with** to **Model's own prediction head (MTP)** or **Companion file**. With a companion, choose the file under **Companion file**. Then **save**.
4. Restart the model. On **Backends**, its line reads **Drafting with** and what it uses, and shows how many of the drafted tokens were kept.

**Draft with** offers only what the model has. It is **Off** until you set it, or until a settings build finds a way that is faster on your machine.

## Reuse of repeated text

**Reuse repeated text** is on for every llama.cpp model and needs no file. When an answer repeats something already in the conversation, such as code it is editing, the repeat is proposed several tokens at a time. It proposes nothing when nothing repeats. Switch it off in the same profile if you do not want it.

<details>
<summary>Good to know</summary>

- Measured on one RTX 5090, one prompt each: Qwen3.5-9B with its own head went from 211.5 to 277.4 tok/s on prose and from 213.1 to 372.8 tok/s on a code edit. Qwen3.6-27B with a companion file went from 70.0 to 149.2 tok/s on prose and from 69.7 to 190.7 tok/s on the edit.
- Results depend on the work. Reusing repeated text made one edit 17 to 25% faster, and with both ways of drafting on, one edit ran slightly slower than with the head alone.
- Drafting needs memory. The model's own head took about 1 GB more graphics memory in the test, a companion up to about 3 GB, and reusing repeated text about 170 MB. These are measured on one machine, not guaranteed.
- The companion must sit in the model's own folder. Eugene refuses one from anywhere else.
- **Tokens drafted per step** is an expert setting. The default is 3.
- A llama.cpp build that does not offer a drafting type is left without it, and the model's line says so.
- vLLM and MLX are not covered here.

</details>
