Optional. The three ports from the [Docker / NAS install](/install#docker) keep working. This puts Workbench, and the console too if you like, behind one HTTPS port, each at its own name.

1. Update Workbench under **Apps** first. Older versions are refused.
2. Point two names at the NAS, or at your reverse proxy: for example `eugene.home.arpa` and `workbench.home.arpa`, in your router's local DNS or each device's hosts file.
3. In the console, open **Settings → Container access setup**. Under **Who manages HTTPS?**, choose your reverse proxy, automatic Let's Encrypt, local certificates, or your own certificate files. Fill in **Base domain** and **Public HTTPS port**.
4. If Eugene serves HTTPS itself, publish that port in your Compose file or NAS settings: `8443:8443` for local certificates, `443:8443` for Let's Encrypt. Behind a reverse proxy on the same Docker network, nothing new is published.
5. Press **Prepare setup**, read **Your prepared setup**, then **Apply…** and **Apply and restart**.
6. Sign in to the console within 15 minutes, as the page says. Otherwise Eugene goes back to how it was, and says why.

The console stays on its own port unless you choose **Through this setup too**. Keep the control root's port published while other machines are joined.

<details>
<summary>Recipes and certificates</summary>

The [container access guide](https://github.com/eugene-plexus/specs/blob/08899f2ca2116ce67dd3051ea17a4c0fecbfc3ec/docs/deployment/container-access.md) compares the options and has recipes for Nginx Proxy Manager, Caddy and Traefik. With local certificates, install only the generated `root.crt` on each device that connects, and keep the rest of `/data/entrypoint` private.

</details>
