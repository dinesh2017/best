const s3Client = require('../config/s3Client');
const asyncHandler = require("express-async-handler");
const { Upload } = require('@aws-sdk/lib-storage');


exports.audioUpload = asyncHandler(async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            req.local = { audioFile: undefined }
        } else {
            audioFile = undefined;
            image = undefined;
            videoFile = undefined;
            if (req.files?.audiofile) {
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
                audioFile = { path: result.Location, name: fileName }
            }
            if (req.files?.videoFile) {
                const file = req.files.videoFile;
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
                videoFile = { path: result.Location, name: fileName }
            }
            if (req.files?.image) {
                const imagefile = req.files.image;
                const imagefileName = `${Date.now().toString()}-${imagefile.name}.png`;
                uploadPath = '/home/ubuntu/best/public/chapters/' + imagefileName;
                req.files?.image.mv(uploadPath);
                image = { path: '/chapters/' + imagefileName, name: imagefileName }
            }
            req.local = {image, audioFile, videoFile}
            
        }
        next()
    }
    catch (err) {
        next(err)
    }
})
