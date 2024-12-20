import { NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const url = searchParams.get("url") as string;

	try {
		const res = await fetch(url);
		const buffer = await res.arrayBuffer();

		const { base64 } = await getPlaiceholder(Buffer.from(buffer));

		return NextResponse.json({ base64 });
	} catch (err) {
		return NextResponse.json({ base64: null });
	}
}
