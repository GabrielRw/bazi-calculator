import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || "5";

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [], count: 0 });
    }

    try {
        const response = await fetch(
            `https://astro-api-1qnc.onrender.com/api/v1/geo/search?q=${encodeURIComponent(query)}&limit=${limit}`,
            {
                headers: {
                    "Accept": "application/json",
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch cities" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("City search proxy error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
