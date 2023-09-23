import { s3Services } from "../../services";
import crypto from "crypto";
import sharp from "sharp";
import { deleteFile, uploadFile } from "../../services/s3Services";

function generateFileName(bytes) {
  return crypto.randomBytes(bytes).toString("hex");
}

const urlPrefix = process.env.AWS_S3_URL_PREFIX;

class S3Controller {
  async handleUploadImages(files) {
    try {
      let imageArr = [];
      for (let f of files) {
        const fileBuffer = await sharp(f.buffer)
          .resize({ height: 1080, width: 1920, fit: "cover" })
          .toBuffer();
        const imageName = generateFileName(10);
        imageArr.push({
          imageName: imageName,
          imageUrl: urlPrefix + imageName,
        });
        await uploadFile(fileBuffer, imageName, f.mimetype);
      }

      return {
        statusCode: 0,
        message: "Tải lên hình ảnh thành công",
        data: imageArr,
      };
    } catch (error) {
      return {
        statusCode: 1,
        message: "Xảy ra lỗi trong quá trình tải lên hình ảnh",
      };
    }
  }

  async handleDelteImages(imgUrls) {
    try {
      for (let url of imgUrls) {
        await deleteFile(url);
      }

      return {
        statusCode: 0,
        message: "Xoá hình ảnh thành công",
      };
    } catch (error) {
      return {
        statusCode: 1,
        message: "Xảy ra lỗi trong quá trình xoá hình ảnh",
      };
    }
  }
}

export default new S3Controller();
