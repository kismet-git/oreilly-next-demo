import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { path, secret } = await req.json();
    const expected = process.env.REVALIDATE_SECRET;

    if (!secret || secret !== expected) {
      console.log("[revalidate] unauthorized", { secretPresent: !!secret });
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (typeof path !== "string" || !path.startsWith("/")) {
      console.log("[revalidate] bad path", path);
      return NextResponse.json({ ok: false, error: "Bad path" }, { status: 400 });
    }

    console.log("[revalidate] revalidating", path);
    revalidatePath(path);
    return NextResponse.json({ ok: true, revalidated: path }, { status: 200 });
  } catch (e) {
    console.error("[revalidate] error", e);
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
