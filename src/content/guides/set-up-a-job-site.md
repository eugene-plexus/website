A Job Site is a person's own computer that Workbench can work on. Each site belongs to one person on the People list, not to the install's owner.

## Before you start

- The machine runs Eugene and has joined your install. See [joining a computer](/install#docker).
- The person is on **People** and may sign in to Workbench. Job Sites are allowed for everyone by default; to set one person's, open **People → Choose what they may do with job sites**.

## Add the machine

1. Signed in to Workbench as that person, open **Job sites (your machines) → Add a job site**, name the machine if you like, and press **Make the command**. Or, in the console: **Job sites → Add a job site**, choose **Whose machine**, then **Make an invitation**.
2. On the machine, within 15 minutes, run the **Windows (PowerShell)** or **Linux** command as administrator or root.
3. Enter the person's Eugene password when it asks. It ends with **Joined as** and the site's name.

## Approvals

- A risky change waits for the person's own key. Pair a passkey under **Job sites → Passkeys → Add a passkey**, with the code the machine's `pair` command shows. Then **Review changes waiting → Approve with your passkey**. It can also be approved at the machine itself.
- One signature opens a window of an hour on that site. **Close it now** ends it early.
- Commands stay off on a machine until an administrator allows them there.

<details>
<summary>Known limits</summary>

- Job Sites cannot yet copy between machines.
- A machine that is only a site, without a full Eugene install, is not supported yet.
- On Windows, a call waits until the person signs in to that machine.
- Entra ID and domain accounts, and network shares, are untested.

</details>
