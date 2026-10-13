A warm standby is a second machine that keeps following the control root's state, so the install's records survive if the root's machine is lost.

1. Pick a machine that has already joined your install.
2. Open **Machines** and find **Standby**.
3. Under **Machine**, choose it, press **Make it the standby**, then **Yes, make it the standby**.

The standby's row shows whether it is up to date. To undo, press **Stop being the standby**, then **Yes, stop it**.

<details>
<summary>Known limits</summary>

- Taking over is done on the standby with your passphrase; it is not a button in the console yet.
- After a switch, only the machine that took over reaches the new root.

</details>
