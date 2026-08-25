import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                   resource_type: "raw",
                   public_id: `uploads/${file.name}`,
                },
                (error, result) => {
                    if (error) {
                        console.error("CLOUDINARY ERROR:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(buffer);
        });

        console.log("CLOUDINARY RESULT:", result);

        return NextResponse.json({
            url: result.secure_url,
        });

    } catch (error) {
        console.error("UPLOAD API ERROR:", error);

        return NextResponse.json(
            {
                error: error.message || "Failed to upload file",
            },
            { status: 500 }
        );
    }
}