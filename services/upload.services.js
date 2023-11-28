const s3Client = require('../config/s3Client');
const { Upload } = require('@aws-sdk/lib-storage');
const Transform = require('stream').Transform;

exports.audioUpload = async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        req.local = {audioFile : undefined}
        next()
    }
    try {
        const file = req.files.audiofile;
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
        req.local = { audioPath: { path: result.Location, name: fileName } }
        next()
    }
    catch (err) {
        next(err)
    }
}