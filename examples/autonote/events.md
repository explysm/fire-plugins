# AutoNote Events API

AutoNote allows you to trigger actions based on both outgoing and incoming messages.

### `utils.onMessage(callback)`
Registers a global listener that triggers for **every** incoming message in any channel.
- `callback`: A function `(message) => {}` that runs for every message.

This is useful for complex logic that doesn't fit into a simple pattern match.

```javascript
// Logs every message you see to the script logs
utils.onMessage((msg) => {
    utils.log(`[${msg.channelId}] ${msg.author.username}: ${msg.content}`);
});
```

### `utils.onMessage(query, mode, callback)`
Registers a listener that triggers only when an incoming message matches the query.
- `query`: The text to search for.
- `mode`: `"contains"`, `"startswith"`, `"match"`, or `"regex"`.
- `callback`: A function `(message) => {}` that runs when a match is found.

```javascript
// Auto-react with a fire emoji when someone mentions "aura"
utils.onMessage("aura", "contains", (msg) => {
    utils.react(msg.id, "🔥");
});
```

### `utils.runAfter(callback)`
Registers a callback that executes **after** the current message is successfully sent to Discord.
- `callback`: A function `(id) => {}` that receives the newly sent message ID.

This is primarily used for self-destructive messages or performing actions that require the message's own ID.

```javascript
// Auto-delete the message after 5 seconds
utils.runAfter(id => {
    setTimeout(() => {
        utils.delete(id);
    }, 5000);
});
return content; // Send the message normally
```
