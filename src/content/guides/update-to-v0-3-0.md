Your models, settings, profiles and chats carry over. The order matters: older roots cannot accept v0.3.0's people fields or check a person's access, so the control root and its standbys go first.

## Before you start

[Make a checkpoint](/recovery) of the stopped installation. An update does not make one for you. Workbench also keeps a copy of its own data, described below.

## Update

1. Update the **control root** and every **standby** first.
   - **A machine:** open **Machines**, find it under **Versions**, press **Update**, then **Update** and the machine's name.
   - **The container:** pull `ghcr.io/eugene-plexus/control-plane:v0.3.0` through Docker or your NAS's controls, and recreate the container with its volumes, ports and hostname unchanged.
2. Still on **Machines → Versions**, press **Update all**, then **Start updates**. It updates the other machines one at a time, then their installed apps, including Workbench. Without it, press **Update** on each machine instead.
3. Update Workbench if it is still behind. It is a separate app update, even when you updated a container. Open **Apps**, open Workbench, and press **Update to** its new version.
4. Each machine under **Versions** now reads **Up to date**.

Machines on mixed versions refuse Workbench's model requests until they match.

## Workbench's data and going back

Workbench moves its data to a new format the first time v0.3.0 starts it. It keeps the old store beside the new one as `workbench.sqlite3.schema-<N>.bak`, where N is the format it was in. Chats written after the update are not in that copy.

To go back to v0.2.3, stop Workbench, install v0.2.3's Workbench, and restore that copy as the store. A v0.2.3 Workbench will not run on a v0.3.0 store.

<details>
<summary>Good to know</summary>

- A container updates through Docker or its NAS controls. **Update all** leaves containers to their host.
- If **Update all** says "Update this console's machine once to enable Update all.", press **Update** on that machine first.
- If Workbench ran again on the old version between two starts, the next copy is named `workbench.sqlite3.schema-<N>.1.bak`. A copy is never written over.
- Data converted from v0.1 is still read in v0.3.0. v0.3.1 removes that conversion, so bring any v0.1 installation through v0.3.0 first.
- The v0.2.3 release limits still apply.

</details>
