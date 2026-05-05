export async function isTwitchLive(username: string) {
  // Get access token
  const tokenRes = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: "POST" }
  );

  const tokenData = await tokenRes.json();

  const accessToken = tokenData.access_token;

  // Check stream
  const streamRes = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${username}`,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const streamData = await streamRes.json();

  return streamData.data.length > 0;
}