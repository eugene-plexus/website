Until you turn it on, only the computer that runs Eugene can open the console. This opens it to your other devices on the same network, or on a private network such as Tailscale.

1. On that computer, open the console's **Home** page and find **Reach it from other devices**. Press **Turn on**.
2. If it says Eugene needs to restart, press **Restart Eugene**. If your firewall blocks the connection, the card shows a command under **Allow it by running this as administrator**. Run it as administrator.
3. The card names the address to open. Put the phone on the same Wi-Fi, or install Tailscale on both and sign in to the same account.
4. Open that address on the phone. Enter your passphrase under **Passphrase** and press **Unlock**.
5. For Workbench, open **Apps** on the phone and press **Open ↗** beside it. Press **Sign in with Eugene** and sign in with your Eugene account. People other than the owner need an account under **People**.
6. A laptop or another computer works the same way from step 3.

To type the address yourself, for a computer with several networks, set **Advertise address** under **Settings → Access & security**. If you reach Eugene by a name of your own, add it to **Allowed host names** there.

<details>
<summary>Good to know</summary>

- Turning it on opens the console, gateway, control root and library to your network. Model engines stay on the machine.
- Do not forward these ports from your router or put them on the public internet. Reaching your home network through a private network such as Tailscale is the safe way in from outside.
- If Windows calls the network Public, it blocks more by default. Change it to Private in **Settings → Network**, or allow Eugene on Public networks too.
- Shared sign-in for administrators and passkeys need HTTPS or `localhost`, so they do not work over a plain `http://` address. For a name with HTTPS, see [Serve the container on one HTTPS port](/guides/container-https).
- Apps that other computers call, such as Claude Code, use the gateway address and a key from **Use it from your apps** on Home.

</details>
