const mongoose = require("mongoose");
const LoginSession = require("../auth/session.model")
const jwt = require('jsonwebtoken');

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S$/,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, "Please add the email"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    name: {
        type: String,
        required: true,
        maxlength: 128,
        index: true,
        trim: true
    },
    picture: {
        path: { type: String },
        name: { type: String }
    }
}, {
    timestamps: true
})
adminSchema.method({
    async token(ip) {
        try {
            const payload = {
                entityType: 'ADMIN',
                entity: this,
                ipAddress: ip,
                channel: 'MOBILE'
            };
            await LoginSession.updateMany({ $set: { isActive: false } })
            const sessionToken = await LoginSession.createSession(payload)
            const token = await jwt.sign(sessionToken, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_MINUTES })
            return token
        } catch (error) {
            throw error
        }
    },
    transform() {
        const transformed = {};

        const fields = [
            'id',
            'email',
            'name',
            'picture', 
            'createdAt', 
            'updatedAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});
adminSchema.statics = {
    async getByMobile(mobile) {
        try {
            let admin;

            if (mobile && mobile.number && mobile.countryCode) {
                admin = await this.findOne({ 'mobile.countryCode': mobile.countryCode, 'mobile.number': mobile.number }).exec();
            }
            if (admin) {
                return admin;
            }

            return null
        } catch (error) {
            throw error;
        }
    },
    async get(id) {
        try {
            let admin;
            if (mongoose.Types.ObjectId.isValid(id)) {
                admin = await this.findById(id).exec();
            }
            if (admin) {
                return admin.transform();
            }
            throw new Error(
                'admin does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async getByMobileOrEmail(email) {
        try {
            let admin;
            if (!admin && email) {
                admin = await this.findOne({ 'email': email }).exec();
            }
            if (admin) {
                return admin;
            }
            return null
        } catch (error) {
            throw error;
        }
    },

    async findAndGenerateToken(options) {
        const { mobile, refreshObject, ip } = options;
        if (!mobile) throw new APIError({ message: 'A mobile number is required to generate a token' });

        const admin = await this.findOne({ 'mobile.countryCode': mobile.countryCode, 'mobile.number': mobile.number }).exec();
        if (mobile) {
            if (admin) {
                
                const accessToken = await admin.token(ip);
                return { admin: admin.transform(), accessToken };
            }
            err.message = 'Incorrect mobile';
        } else if (refreshObject && refreshObject.adminEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = 'Invalid refresh token.';
            } else {
                return { admin, accessToken: admin.token() };
            }
        } else {
            err.message = 'Incorrect mobile or refreshToken';
        }
        throw new Error("Unauthorized");
    },
    async findAndGenerateTokenByEmail(options) {
        const { email, refreshObject, ip } = options;
        if (!email) throw new APIError({ message: 'Email is required to generate a token' });

        const admin = await this.findOne({ 'email': email }).exec();
        if (email) {
            if (admin) {
                const accessToken = await admin.token(ip);
                return { admin: admin.transform(), accessToken };
            }
            err.message = 'Incorrect Email';
        } else if (refreshObject && refreshObject.adminEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = 'Invalid refresh token.';
            } else {
                return { admin, accessToken: admin.token() };
            }
        } else {
            err.message = 'Incorrect email or refreshToken';
        }
        throw new Error("Unauthorized");
    },
}
module.exports = mongoose.model("Admin", adminSchema);