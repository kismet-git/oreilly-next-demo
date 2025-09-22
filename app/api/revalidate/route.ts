import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { path, secret } = await req.json();
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (typeof path !== "string" || !path.startsWith("/")) {
      return NextResponse.json({ ok: false, error: "Bad path" }, { status: 400 });
    }
    revalidatePath(path);
    return NextResponse.json({ ok: true, revalidated: path }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
