const STREAMER_ROLE_IDS = [
  "1502329468432416798"
];

export function isStreamer(
  user: any
) {
  if (!user?.roles) return false;

  return user.roles.some(
    (role: string) =>
      STREAMER_ROLE_IDS.includes(role)
  );
}