Eugene can answer on two HTTPS names on one port: `eugene.<your domain>` for the console and sign-in, and `workbench.<your domain>` for Workbench. The model API can sit on the first, at `https://eugene.<your domain>/inference/v1`. It is off until you turn it on.

1. Follow [Serve the container on one HTTPS port](/guides/container-https) as far as **Settings → Container access setup**. It covers **Who manages HTTPS?**, **Base domain**, **Public HTTPS port** and the certificates.
2. Under **Where do you open the console?**, keep **Through this setup too** (recommended). In **Allowed private networks**, list the home, office or VPN networks that may connect.
3. Tick **Enable the model API for other apps**. Under **Model API address**, choose **Use Eugene’s address (recommended)**. The address it shows is the one to give your apps.
4. Leave **Allow inference from any network, with an API key** unticked unless apps connect from outside your private networks.
5. Press **Prepare setup**, read **Your prepared setup**, then **Apply…** and **Apply and restart**.
6. In the app, use that address as the base URL. Make a key under **Use it from your apps** on Home.

## Keep an old inference hostname while clients move

If you already have a separate inference hostname, choose **Use Eugene’s address (recommended)** and tick **Keep the existing inference address working during migration**. Its network rules stay as they were. Prepare and apply. When every client uses the new address, open the page again, untick it, and apply once more.

<details>
<summary>Good to know</summary>

- With the model API off, `/inference/v1` is refused and does not fall through to the console. The console's Engines page at `/inference/` keeps working.
- Model API requests still need an Eugene key, and its model permissions and limits apply. The network rules for the API are separate from those for the console.
- A setup made before v0.3.0 keeps its saved hostnames, console placement and network rules.
- Sign-in uses `https://eugene.<your domain>/oidc` unless you saved another address. See [sign-in with Google or Microsoft](/guides/sign-in-with-google-or-microsoft).
- Keep the control root's port published while joined machines use it. This setup does not change their saved address.
- Preparing a setup changes nothing. If you do not sign in again within 15 minutes of applying, Eugene goes back to how it was.

</details>
