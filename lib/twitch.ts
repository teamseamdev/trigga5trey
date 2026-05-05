export async function isTwitchLive(username: string) {
  try {
    const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      cache: "no-store",
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const streamRes = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${username}`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID!,
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const streamData = await streamRes.json();

    return streamData.data && streamData.data.length > 0;
  } catch (err) {
    console.error("Twitch API error:", err);
    return false;
  }
}