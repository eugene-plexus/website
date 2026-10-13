Eugene checks each model against this machine's graphics memory (VRAM) and RAM before you download it.

## Find a model that runs here

1. Open **Discover**. It opens on **Works here now**; the filter also offers **Works with another engine** and **Everything**.
2. Search, or paste a Hugging Face link. Each result's dot says **works here**, **other engine** or **not here**.
3. Click the dot to see which engines can run it on this machine, each with its reason, and whether it **fits**, is **tight**, **fits, slower** or **does not fit**.
4. Download it, then press **Run** on its page.

## Add a model hub

1. Open **Settings → Models & downloads → Where to find models**, and choose **add a hub**.
2. Enter the **Hub address** and its **Access token**. Each hub is sent only its own token.
3. Use the arrows to set the order, then **Save**.

## Delete a model

1. On the model's page, press **Delete…**.
2. Read the list: every file that goes, and, under **Kept, because other models use them**, the files that stay.
3. Press **Delete and free** (with the size). It cannot be undone. A model a machine is running must be stopped there first.

## Strata (experimental)

In Discover, choose **Works with another engine**, open a model from Strata's list, and press **Download and prepare for Strata**. On a model's page, Run may suggest **Prepare for Strata, then run (recommended)** when Strata suits this machine better. Strata runs text only, on one GPU, one request at a time, and its memory fit is unknown.
