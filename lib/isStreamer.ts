export function isStreamer(
  user: any
) {
  const streamerRole =
    process.env
      .NEXT_PUBLIC_DISCORD_STREAMER_ROLE_ID;

  if (!streamerRole)
    return false;

  const roles =
    user?.roles || [];

  return roles.includes(
    streamerRole
  );
}