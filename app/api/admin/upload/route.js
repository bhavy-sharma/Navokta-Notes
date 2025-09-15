import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { OAuth2Client } from "google-auth-library"; // 👈 NAYA IMPORT!

export const runtime = 'nodejs'; // 👈 ZAROORI!

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const accessToken = authHeader.split(" ")[1];

    // ✅ SAHI TARIKA: OAuth2Client banayein aur token daalein
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken }); // 👈 YEH SAHI HAI!

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client, // 👈 Ab yeh object hai — jisme request() function hai!
    });

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type || "application/pdf",
      },
      media: {
        mimeType: file.type || "application/pdf",
        body: readableStream,
      },
      fields: "id, webViewLink",
      uploadType: "multipart",
    });

    return NextResponse.json({ file: response.data });
  } catch (error) {
    console.error("Upload error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}