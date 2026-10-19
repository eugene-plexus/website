The Library reads model files where they already are. It does not move or copy them, and you do not download them again.

1. Open **Library → Folders**.
2. Press **add folder**. Type the folder's path, or press **browse** to pick it. Write the path as the machine the Library runs on writes it.
3. Press **save folders**.
4. Open **Library** and press **scan**. The models appear in the list, and the page says when it last scanned.

Subfolders are searched. A model is one `.gguf` file, the first file of a split model, or a safetensors folder. A vision projector, a companion for [speculative decoding](/guides/speed-up-with-speculative-decoding) and the later pieces of a split model are not listed as models of their own.

## If a model is missing

With no model selected, **Library** shows a link such as **show 12 skipped paths**. Open it. It lists every file the scan passed over, each with its reason, for example **not a model**, **could not be read**, **unsupported format** or **partial download**.

## A folder on a NAS

If your other machines reach the folder by a different path, fill in the folder's row on **Library → Folders**:

1. Under **Mounted on Linux / macOS nodes at**, type the path those machines use, for example `/mnt/models`.
2. Under **Mounted on Windows nodes at**, type the path Windows machines use, for example `\\NAS\models`.
3. Press **save folders**.

A machine that mounts the share somewhere else gets its own path: click the machine's name in the table's header, type the path in its **Override** box, and press **save overrides**.

<details>
<summary>Good to know</summary>

- A machine runs a model only from one of these folders.
- The scan skips symlinked folders unless **Follow symlinked directories** is on in the Library's settings. A folder you add yourself is always scanned.
- Scanning at startup is on by default. Turn off **Scan at startup** for a slow share, and press **scan** when you want it.
- Files that have not changed are not read again. **full rescan** reads every model's header again.
- The Library reads `.gguf` and safetensors files. Ollama keeps its models as hash-named blob files, which the Library does not read as models.
- **remove** on a folder only stops the Library listing it. Nothing on disk is touched.

</details>
