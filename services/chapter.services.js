const Chapter = require("../models/chapter.model");
const Library = require("../models/library.model");
const asyncHandler = require("express-async-handler");
const APIError = require('../utils/APIError');
const { readAudioFile } = require("../services/upload.services");
const { PassThrough } = require('stream');
const s3Client = require('../config/s3Client');
const { GetObjectCommand } = require('@aws-sdk/client-s3');

exports.getChaptersByStory = asyncHandler(async (req, res, next) => {
    try {
        let { storyId } = req.params
        req.query.story = storyId
        const { chapters, count, pages } = await Chapter.list(req.query);
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: chapters,
            count, pages
        });

    } catch (error) {
        next(new APIError(error));
    }
})

exports.getChatpterById = asyncHandler(async (req, res, next) => {
    try {
        const chapter = await Chapter.get(req.params.id)
        if (!chapter) {
            res.status(404);
            throw new Error("Chapter not found")
        }
        let { entity } = req.user;
        const library = await Library.findOne({ chapter: chapter.id, type: "FAVORITE", user: entity });
        const subscription = { ...chapter };
        if (library)
            subscription.status = (library.status) ? library.status : false;
        else
            subscription.status = false;
        subscription.audioFile = req.protocol + "://" + req.get('host') + "/chapter/getaduio/" + chapter.id;
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapter: subscription,
        });

    } catch (error) {
        next(new APIError(error));
    }
})

exports.getChatpterAudioById = asyncHandler(async (req, res, next) => {
    try {
        const chapter = await Chapter.get(req.params.id)
        if (!chapter) {
            res.status(404);
            throw new Error("Chapter not found")
        }
        const downloadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: chapter.audioFile.name,
        };
        const passThroughStream = new PassThrough();
        s3Client.send(new GetObjectCommand(downloadParams))
            .then((data) => {
                data.Body.pipe(passThroughStream);
            })
            .catch((error) => {
                console.error('Error reading audio file from S3:', error);
                res.status(500).send('Internal Server Error');
            });
        res.setHeader('Content-Type', 'audio/mp3');
        res.setHeader('Content-Disposition', 'inline; filename=audio.mp3');

        // Pipe the pass-through stream to the response
        passThroughStream.pipe(res);

        // Handle errors during the streaming process
        passThroughStream.on('error', (error) => {
            console.error('Error streaming audio:', error);
            res.status(500).send('Internal Server Error');
        });

        res.on('finish', () => {
            console.log('Audio playback finished');
        });

        res.on('close', () => {
            // Close the pass-through stream when the response is closed
            passThroughStream.end();
        });
    } catch (error) {
        next(new APIError(error));
    }
})