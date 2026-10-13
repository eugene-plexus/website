Workbench keeps short notes about you and gives them to the model in your chats. Only you can see your notes.

## Keep a note

- In any chat, start a message with "Remember that", for example: *Remember that I use metric units.* Workbench keeps the first sentence as a note, still sends your message, and offers **Undo**.
- Or press **Remember this** on a message or an answer.
- Or open **Memory**. With no notes yet, fill in **About me** and **How I want answers**, and press **Save these notes**. After that, use **Add a note**: write it, choose its **Kind**, and press **Add note**.

A note is one line of up to 240 characters. Workbench will not keep passwords, keys or card numbers.

## Change or delete a note

On **Memory**, each note has **Edit**, **Pin** and **Delete**. Pinned notes and instructions go to every chat first. Other notes are used when there is room. A deleted note offers **Undo** for a few seconds.

To forget a note from a chat, start a message with "Forget". Workbench lists the notes that match and deletes only the one you choose.

## See what a chat sent

Press the **Memory** chip at the top of the chat. **Memory in this chat** lists the notes **Sent to the model** and **Not sent**, and shows **The exact text the model was given**.

A chat keeps the notes it started with. After you add or edit notes, press **Refresh memory** there. A deleted note leaves every chat at once.

## Turn memory off

- For one chat: press the **Memory** chip and switch off **Memory in this chat**.
- For you: on **Memory**, under **Settings**, switch off **Use memory**. Your notes stay saved.

## Models outside your machines

By default, a cloud model gets no notes. The chat says so and offers **Send for this chat**. To decide once for every chat, set **Memory → Settings → Models that run outside your machines** to **Ask me in each chat**, **Never send them** or **Always send them**.

## Export or delete everything

Under **Export or delete** on **Memory**: **Export as Markdown**, **Export as JSON**, or **Delete all memory**, which asks you to type DELETE first.

<details>
<summary>Good to know</summary>

- Notes get up to 1,000 tokens in a chat, or 8% of the model's window if that is less. Change it under **How much room notes may take**.
- A model with a window under 4,096 tokens gets no notes.
- One person can keep 300 notes, unless the owner changes it.
- The owner can turn memory off for everyone, or stop notes going to models outside your machines for everyone, in Workbench's settings in Eugene's console.
- Even an owner who can read chats cannot open your Memory page.

</details>
