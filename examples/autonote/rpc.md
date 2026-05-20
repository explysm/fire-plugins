# Rich Presence API

These utilities allow you to manage a custom Discord Rich Presence activity directly from your scripts. The activity will persist across navigation until you explicitly remove it.

### `utils.rpc_set(activity)`
Sets a custom Rich Presence activity.
- `activity`: An object containing activity fields.

Fields like `activity` (or `name`), `details`, `state`, `type`, `assets`, and `buttons` are fully supported.
- **Image URLs**: If you provide a URL for `large_image` or `small_image` (e.g., `https://...`), it will be automatically proxied and displayed.

```javascript
utils.rpc_set({
    activity: "Swear Counter",
    details: "Total swears: " + (utils.storage.badWords || 0),
    state: "Listening to music",
    type: 0, // 0: Playing, 1: Streaming, 2: Listening, 3: Watching, 5: Competing
    assets: {
        large_image: "https://i.imgur.com/my_icon.png",
        large_text: "My Custom Icon"
    },
    buttons: [
        { label: "Check my stats", url: "https://my-site.com" }
    ]
});
```

### `utils.rpc_remove()`
Clears the current Rich Presence activity.

```javascript
utils.rpc_remove();
```
