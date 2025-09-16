import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { OAuth2Client } from "google-auth-library";

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No token" }, { status: 401 });

    const accessToken = authHeader.split(" ")[1];
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Read raw file buffer (frontend must send file as body without manual Content-Type)
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: "uploaded-file.pdf", // desired filename
        mimeType: "application/pdf",
      },
      media: {
        mimeType: "application/pdf",
        body: readableStream,
      },
      fields: "id, webViewLink",
      uploadType: "multipart", // ✅ must use multipart for metadata + file
    });

    return NextResponse.json({ file: response.data });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
