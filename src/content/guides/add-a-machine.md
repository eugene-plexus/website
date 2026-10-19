Another computer joins your install with one command that installs Eugene there and enrolls it with the control root. Models can then run on it.

1. On the control root's console, open **Machines** and find **Add a node**.
2. Give it a name in **Node name (optional)** if you like. In **Control root URL the other machine can reach**, enter the root's address with its control port. The page lists the three ports and marks the control root's, and warns if the address names the wrong one or only works on this machine.
3. Press **Make a join token**. The token works once and is shown once. It expires after 15 minutes.
4. Press **Copy Windows command** or **Copy Linux or macOS command**, and run it on the new machine: **Windows, in PowerShell** asks for administrator rights, and **Linux or macOS, in a terminal** may ask for your password.
5. Back on **Machines**, the new machine appears under **This install**. Check that its status reads as reachable.

<details>
<summary>Good to know</summary>

- A worker runs its own agent and the engines and models you start on it. The control root, one for the whole install, keeps the accounts, keys and records. The **Role** column shows `control`, `standby` or `agent`.
- If Eugene is already on that machine, the command moves it aside first. Nothing is deleted, and if the join fails it is put back.
- A token you made by mistake appears under **Outstanding tokens**. Press **Revoke**.
- The console has no button to remove a machine that has joined. To take Eugene off one, follow [Remove Eugene](/install#remove) on that machine.
- A worker that runs models also needs your model folder. [Join the computer that will run models](/install#join) covers sharing it.
- On a NAS container, the root's address is the one for the published control port. With [one HTTPS port](/guides/container-https) and a node name, the box shows that address instead.

</details>
