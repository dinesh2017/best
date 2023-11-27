const mongoose = require("mongoose");
const Schema = mongoose.Schema;
addMinutes = require("date-fns/addMinutes");
const { v4: uuidv4 } = require('uuid');

const EntityTypes = ["USER","ADMIN"]
const sessionSchema = new mongoose.Schema(
    {
        entity: { type: Schema.Types.ObjectId, required: true },
        entityType: { type: String, enum: EntityTypes },
        name: { type: String },
        role: { type: String },
        agentType: { type: String },
        ipAddress: { type: String },
        token: { type: String, required: true },
        loginTime: { type: Date, default: new Date() },
        logoutTime: {
            type: Date,
            default: addMinutes(new Date(),0)
        },
        isActive: { type: Boolean, default: true },
        channel: { type: String, enum: ["WEB", "MOBILE"], default: "MOBILE" }
    },
    {
        timestamps: true
    }
)

sessionSchema.statics = {
    async createSession(sessionData) {
        try {
            let session = new this(sessionData)
            const entity = sessionData.entity
            session.firstName = entity.firstName
            session.lastName = entity.lastName
            session.role = "USER"
            session.token = uuidv4()
            session.logoutTime = addMinutes(new Date(), 43200)
            loginSession = await session.save()
            return { token: loginSession }
        } catch (error) {
            throw error
        }
    },

    closeSessions(userId, channel = "MOBILE", cb) {
        console.log(`closing open sessions for userId: ${userId}`)
        cb(null)
    }
}

module.exports = mongoose.model("Session", sessionSchema)