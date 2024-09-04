import sharp from "sharp";
import axios from "axios";

export async function resizeAndConvertImage(imageUrl, width, height) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");
    const resizedImage = await sharp(imageBuffer)
      .resize(width, height)
      .toBuffer();

    const base64Image = resizedImage.toString("base64");
    console.log(base64Image);

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
