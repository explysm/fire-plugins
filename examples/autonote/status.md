# Status & Presence API

These utilities allow you to programmatically change your Discord status and online presence.

### `utils.status(text)`
Sets your custom status message.
- `text`: The status text to display. Pass an empty string or `null` to clear it.

Note: This only sets the text. To change your online status (Online, Idle, etc.), use `utils.statusOnline`.

```javascript
// Set a custom status
utils.status("Vibe coding in Termux 📱");

// Clear custom status
utils.status("");
```

### `utils.statusOnline(presence)`
Sets your online presence status.
- `presence`: One of `"online"`, `"idle"`, `"dnd"`, or `"invisible"`.

```javascript
// Go into "Do Not Disturb" mode
utils.statusOnline("dnd");

// Go back to "Online"
utils.statusOnline("online");

// Set to "Idle"
utils.statusOnline("idle");
```

## Combined Example
You can combine these to fully automate your profile state.

```javascript
// Auto-AFK script
if (content === "!afk") {
    utils.status("I am currently AFK");
    utils.statusOnline("idle");
    utils.toast("AFK mode enabled");
    return "Going AFK now.";
}
```
