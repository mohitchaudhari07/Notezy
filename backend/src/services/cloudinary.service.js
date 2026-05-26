const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

class CloudinaryService {
  /**
   * Uploads file buffer directly to Cloudinary
   * @param {Buffer} fileBuffer - The file buffer from Multer
   * @param {String} folder - Cloudinary folder name
   * @param {String} resourceType - Cloudinary resource type (image, raw, video, auto)
   */
  async uploadBuffer(fileBuffer, folder = 'engipyq/documents', resourceType = 'auto') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary Upload Error:', error);
            return reject(new ApiError(500, `Cloudinary upload failed: ${error.message}`));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format
          });
        }
      );

      // Write buffer to readable stream
      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Deletes asset from Cloudinary
   * @param {String} publicId - Cloudinary public asset ID
   * @param {String} resourceType - Cloudinary resource type (image, raw, video)
   */
  async deleteAsset(publicId, resourceType = 'image') {
    try {
      if (!publicId) return null;
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return result;
    } catch (error) {
      console.error('❌ Cloudinary Deletion Error:', error);
      throw new ApiError(500, `Cloudinary deletion failed: ${error.message}`);
    }
  }
}

module.exports = new CloudinaryService();
