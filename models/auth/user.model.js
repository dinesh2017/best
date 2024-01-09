const mongoose = require("mongoose");
const LoginSession = require("../auth/session.model")
const jwt = require('jsonwebtoken');
const Gender = ["MALE", "FEMALE", "OTHER"]

const userSchema = mongoose.Schema({
    mobile: {
        countryCode: { type: String },
        number: { type: String }
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        // unique: [true, 'User email already exists'],
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: 128,
        index: true,
        trim: true
    },
    password: { type: String },
    from: { 
        type: String,
        enum : ["FACEBOOK","GOOGLE","APP"],
        default:"APP"
    },
    gender: { type: String, enum: Gender },
    dob: { type: Date },
    mobileDeviceInfo: {
        fcmId: String,
        platformType: { type: String, enum: ['ANDROID', 'IOS'] },
        make: String,
        model: String,
    },
    picture: {
        path: { type: String },
        name: { type: String }
    }
},
    {
        timestamps: true
    });


userSchema.method({
    async token(ip) {
        try {
            const payload = {
                entityType: 'USER',
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
            'mobile',
            'email',
            'name',
            'gender',
            'dob',
            'mobileDeviceInfo',
            'age',
            'location',
            'picture', 'createdAt', 'updatedAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});
userSchema.statics = {
    async getByMobile(mobile) {
        try {
            let user;

            if (mobile && mobile.number && mobile.countryCode) {
                user = await this.findOne({ 'mobile.countryCode': mobile.countryCode, 'mobile.number': mobile.number }).exec();
            }
            if (user) {
                return user;
            }

            return null
        } catch (error) {
            throw error;
        }
    },
    async get(id) {
        try {
            let user;
            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user.transform();
            }
            throw new Error(
                'user does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async getByMobileOrEmail(mobile, email) {
        try {
            let user;
            if (mobile && mobile.number && mobile.countryCode) {
                user = await this.findOne({ 'mobile.countryCode': mobile.countryCode, 'mobile.number': mobile.number }).exec();
            }
            if (!user && email) {
                user = await this.findOne({ 'email': email }).exec();
            }
            if (user) {
                return user;
            }

            return null
        } catch (error) {
            throw error;
        }
    },

    async findAndGenerateToken(options) {
        const { mobile, refreshObject, ip } = options;
        if (!mobile) throw new APIError({ message: 'A mobile number is required to generate a token' });

        const user = await this.findOne({ 'mobile.countryCode': mobile.countryCode, 'mobile.number': mobile.number }).exec();
        if (mobile) {
            if (user) {
                const accessToken = await user.token(ip);
                return { user: user.transform(), accessToken };
            }
            err.message = 'Incorrect mobile';
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = 'Invalid refresh token.';
            } else {
                return { user, accessToken: user.token() };
            }
        } else {
            err.message = 'Incorrect mobile or refreshToken';
        }
        throw new Error("Unauthorized");
    },
    async findAndGenerateTokenByEmail(options) {
        const { email, refreshObject, ip } = options;
        if (!email) throw new APIError({ message: 'Email is required to generate a token' });

        const user = await this.findOne({ 'email': email }).exec();
        if (email) {
            if (user) {
                const accessToken = await user.token(ip);
                return { user: user.transform(), accessToken };
            }
            err.message = 'Incorrect Email';
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = 'Invalid refresh token.';
            } else {
                return { user, accessToken: user.token() };
            }
        } else {
            err.message = 'Incorrect email or refreshToken';
        }
        throw new Error("Unauthorized");
    },
}
module.exports = mongoose.model("User", userSchema);