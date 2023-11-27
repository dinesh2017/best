const s3Client = require('../config/s3Client');
const { Upload } = require('@aws-sdk/lib-storage');
const Transform = require('stream').Transform;

exports.fileUpload = async (req, res, next) => {
    const file = req.files.file;

    if (!file || Object.keys(file).length === 0) {
        next()
    }
    try {
        const fileName = `${Date.now().toString()}-${file.name}`;
        
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.S3_BUCKET,
                Key: fileName,
                Body: file.data
            }
        });
        const result = await upload.done();
        req.local = { image: { path: result.Location, name: fileName } }
        next()
    }
    catch (err) {
        next(err)
    }
}