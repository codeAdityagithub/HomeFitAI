import db from "@/utils/db.server";
import { json } from "@remix-run/node";

export default async function deletePlaylist(pId: string, userId: string) {
  try {
    await db.playlist.delete({ where: { userId, id: pId } });
    return json(
      { message: "Playlist deleted successfully.", ok: true },
      { status: 200 }
    );
  } catch (error) {
    return json(
      { error: "Failed to delete playlist.", ok: false },
      { status: 500 }
    );
  }
}
