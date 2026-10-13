Your models, settings, profiles and chats carry over. v0.2.0 converts what v0.1.0 saved the first time it starts, and keeps each old file beside it as a `.v0.1.bak` copy.

## Before you start

[Make a checkpoint](/recovery). An update does not make one for you.

## Update

1. Update the **control root** first: the machine you set up first, or the container on your NAS.
   - **A machine:** open **Machines**, find it under **Versions**, press **Update**, then **Update** and the machine's name.
   - **The container:** pull `ghcr.io/eugene-plexus/control-plane:v0.2.0` and recreate the container with its volumes, ports and hostname unchanged. **Machines → Versions** shows the command.
2. Sign in again when the console comes back.
3. Update every other machine the same way. A machine left on v0.1.0 will not work with a v0.2.0 root.
4. On **Machines → Versions**, each machine now reads **Up to date**.

A Linux system install has been measured updating from v0.1.0 to v0.2.0. A Windows machine updating itself from the console has been seen once, not measured.

## After the update

<details>
<summary>Seven things that may need a minute</summary>

- **Library sources.** If you saved your sources with the hub first, move **Engines' own lists** back up: **Settings → Models & downloads → Where to find models**, then **Save**.
- **Hub token.** A Library saved before the source list gets the default list. Enter your token again in the hub row's **Access token** field.
- **Strata.** Reinstall it before its first preparation. In **Backends**, on the machine's engines line, **Uninstall** strata, then **Install** it. Prepared models are kept.
- **Open WebUI** resets its saved settings to Eugene's once, at its first v0.2.0 start.
- **Open WebUI keys** made earlier keep their old limits. Raise them on Home, under **Use it from your apps**, with **Edit limits**.
- The old `/runtimes` address is gone; use `/inference`.
- The "cyberpunk" theme name is gone; use Plexus.

</details>

## Coming from an alpha

Move to v0.1.0 first, with v0.1.0's own install command on each machine, then follow this guide. See [the install page's update commands](/install#update).
