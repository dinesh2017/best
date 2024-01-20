const Chapter = require("../models/chapter.model");
const Library = require("../models/library.model");
const asyncHandler = require("express-async-handler");
const APIError = require('../utils/APIError');
const { readAudioFile } = require("../services/upload.services");
const { PassThrough } = require('stream');
const s3Client = require('../config/s3Client');
const { GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getAudio } = require("../config/audioConfig");

exports.getChaptersByStory = asyncHandler(async (req, res, next) => {
    try {
        let { entity } = req.user;
        let { storyId } = req.params
        req.query.story = storyId
        const { chapters, count, pages } = await Chapter.list(req.query);
        let modifiedChapters = await Promise.all(chapters.map(async (x)=>{
            x.audioFile = getAudio(x)//;req.protocol + "://" + req.get('host') + "/chapter/getaduio/" + x.id;
            const {ResumeStatus, ResumeTime, ResumeTimeInSec , timeInSecTotal, BookMarkStatus, time, timeInSec, status} = await getResumeData(x, entity);
            x.ResumeStatus = ResumeStatus;
            x.ResumeTime = ResumeTime;
            x.ResumeTimeInSec = ResumeTimeInSec;
            x.timeInSecTotal = timeInSecTotal;
            x.BookMarkStatus = BookMarkStatus;
            x.time = time;
            x.timeInSec = timeInSec;
            x.status = status;
            return x;    
        }));
        
        res.status(200).json({
            status: 200,
            message: "SUCCESS",
            chapters: modifiedChapters,
            count, pages
        });

    } catch (error) {
        next(new APIError(error));
    }
})

const getResumeData = async(chapter, entity)=>{
    let ResumeStatus = false;let ResumeTime = "00:00:00";let ResumeTimeInSec = 0;let timeInSecTotal =0;
    const resume = await Library.findOne({ chapter: chapter.id, type: "RESUME", user: entity });
    const library = await Library.findOne({ chapter: chapter.id, type: "FAVORITE", user: entity });
    const boomark = await Library.findOne({ chapter: chapter.id, type: "BOOKMARK", user: entity });
    let status = false;let BookMarkStatus = false; let time = "00:00:00"; let timeInSec = 0;
    if (library)
        status = (library.status) ? library.status : false;
    else
        status = false;

    if (boomark){
        BookMarkStatus = (boomark.status) ? boomark.status : false;
        time = (boomark.time)?boomark.time:"00:00:00";
        timeInSec = (boomark.timeInSec)?boomark.timeInSec:"0";
    }
    else{
        BookMarkStatus = false;
        time = "00:00:00";
        timeInSec = 0;
    }

    if(resume){
        ResumeStatus = (resume.status) ? resume.status : false;
        ResumeTime = (resume.time)?resume.time:"00:00:00";
        ResumeTimeInSec = (resume.timeInSec)?resume.timeInSec:0;
        timeInSecTotal = (resume.timeInSecTotal)?resume.timeInSecTotal:0;
    }else{
        ResumeStatus = false;
        ResumeTime = "00:00:00";
        ResumeTimeInSec = 0;
        timeInSecTotal = 0;
    }
    return {ResumeStatus, ResumeTime, ResumeTimeInSec , timeInSecTotal, BookMarkStatus, time, timeInSec, status};
}

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

        const library_ = await Library.findOne({ chapter: chapter.id, type: "BOOKMARK", user: entity });
        if (library_){
            subscription.BookMarkStatus = (library_.status) ? library_.status : false;
            subscription.time = (library_.time)?library_.time:"00:00:00";
            subscription.timeInSec = (library_.timeInSec)?library_.timeInSec:"0";
        }
        else{
            subscription.BookMarkStatus = false;
            subscription.time = "00:00:00";
            subscription.timeInSec = 0;
        }
        const resume = await Library.findOne({ chapter: chapter.id, type: "RESUME", user: entity });
        if(resume){
            subscription.ResumeStatus = (resume.status) ? resume.status : false;
            subscription.ResumeTime = (resume.time)?resume.time:"00:00:00";
            subscription.ResumeTimeInSec = (resume.timeInSec)?resume.timeInSec:0;
        }else{
            subscription.ResumeStatus = false;
            subscription.ResumeTime = "00:00:00";
            subscription.ResumeTimeInSec = 0;
        }
            

        if(subscription.audioFile)
            subscription.audioFile = getAudio(chapter);//req.protocol + "://" + req.get('host') + "/chapter/getaduio/" + chapter.id;
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
        const { ContentLength } = await s3Client.send(new HeadObjectCommand(downloadParams));
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
        res.setHeader('Content-Length', ContentLength);

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