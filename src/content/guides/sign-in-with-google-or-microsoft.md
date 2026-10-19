Let people you invite sign in to Workbench with a Google, Microsoft or OpenID Connect account. Local passwords keep working beside it.

1. In the console, open **People** and open **External sign-in**. Under **1. Eugene’s sign-in address**, check the address. If you set up [one HTTPS port](/guides/container-https), it is already there. Otherwise type your console's HTTPS name followed by `/oidc` into **Eugene sign-in address** and press **Save sign-in address**.
2. Press **Copy callback URL**. At Google, Microsoft or your identity provider, register a web application and paste it as the redirect address. **Google setup** and **Microsoft setup** link to each provider's instructions. Keep the client ID and client secret it gives you. For Microsoft, also keep the directory (tenant) ID.
3. Under **2. Connect a provider**, press **Add sign-in provider** and choose **Provider**:
   - **Google:** nothing else to choose.
   - **Microsoft:** enter **Microsoft tenant ID**, or press **Use personal Microsoft accounts**.
   - **OpenID Connect:** enter **Provider issuer**, and set **Client-secret method** to **HTTP Basic** or **Request body**, whichever your provider expects.
4. Fill in **Client ID** and **Client secret**. **Button label** is the name people see on the sign-in page. Leave **Offer this sign-in provider** ticked and press **Save provider**.
5. Open the person's account in **People**. In **Sign-in and sessions**, choose the provider under **Invite through** and press **Create sign-in invitation**. Press **Copy sign-in invitation**, send it to them privately, then press **I have copied the invitation**.
6. The person opens the address, enters the code in **Invitation code**, presses **Continue**, then **Connect with** the provider and signs in there. Next time they press **Continue with** the provider's **Button label** on the sign-in page.

<details>
<summary>Good to know</summary>

- An invitation works once and ends after 24 hours. Only an invited account can connect; a matching email address never grants access. **Revoke invitation** withdraws one that is waiting.
- If someone loses their provider account, open their account and press **Disconnect** under **Connected accounts**. For a forgotten password, use **Reset password** under **Account actions**, enter **New password** and press **Set password**.
- Saving an existing provider ends its current Eugene sessions. To change the issuer, tenant or client ID, add a new provider. **Remove** disconnects every account linked through it.
- A saved sign-in address stays in force when you later run **Container access setup**. **Use access setup address** switches back to the one it suggests.
- If you have a warm standby, update it with the root before you turn this on. Both must use the same sign-in address.
- Named administrators can use **Use shared sign-in or a provider** at **People and access sign-in**. It needs HTTPS or `localhost`.

</details>
