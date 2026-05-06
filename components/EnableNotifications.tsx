"use client";

export default function EnableNotifications() {
  const handleClick = async () => {
    const permission = await Notification.requestPermission();
    alert("Permission: " + permission);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "12px 20px",
        background: "#ff7a00",
        borderRadius: "8px",
        color: "#000",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
      }}
    >
      Enable Notifications 🔔
    </button>
  );
}