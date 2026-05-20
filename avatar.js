// Avatar Retrieval Script
// Trigger: $avatar [mention or uid]
// Extracts the user ID, fetches user, and returns avatar URL

const args = content.split(" ");
const input = args[1];

if (input) {
    // Extract ID from mention or use input as ID
    const userId = input.replace(/[<@!>]/g, "");

    // Register task to run AFTER message is sent
    utils.runAfter((id) => {
        utils.import("@vendetta/metro")
            .then(m => m.findByProps("getUser").getUser(userId))
            .then(user => {
                if (!user) {
                    utils.send("Could not find that user.");
                    return;
                }

                const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith("a_") ? "gif" : "png"}?size=1024`;

                utils.send("```" + user.username + "'s avatar:```\n" + avatarURL);
            })
            .catch(e => {
                utils.log("Error fetching avatar: " + e.message);
            });
    });
}

// Return original content so message sends normally
return content;
