// Avatar Retrieval Script
// Trigger: $avatar [mention or uid]
// Extracts the user ID, fetches user, and returns avatar URL

const args = content.split(" ");
const input = args[1];

if (!input) {
    utils.send("Please provide a user mention or ID! (e.g., $avatar @user or $avatar 1234567890)");
    return null;
}

// Extract ID from mention or use input as ID
const userId = input.replace(/[<@!>]/g, "");

try {
    // Attempt to fetch user profile
    const user = await utils.import("@vendetta/metro").then(m => m.findByProps("getUser").getUser(userId));

    if (!user) {
        utils.send("Could not find that user.");
        return null;
    }

    const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith("a_") ? "gif" : "png"}?size=1024`;

    utils.send(`\`\`\`${user.username}'s avatar:\`\`\`\n${avatarURL}`);
} catch (e) {
    utils.log("Error fetching avatar: " + e.message);
    utils.send("An error occurred while fetching the avatar.");
}

return null; // Cancel the original trigger message
