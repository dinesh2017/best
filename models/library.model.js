const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');
const { format } = require('date-fns');

const librarySchema = mongoose.Schema({
    story: {
        type: Schema.Types.ObjectId,
        ref: "Story"
    },
    chapter: {
        type: Schema.Types.ObjectId,
        ref: "Chapter"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: Boolean,
    },
    time: {
        type: String,
    },
    timeInSecTotal:{
        type:String
    },
    timeInSec:{
        type: String,
    },
    type: {
        type: String,
        enum:['BOOKMARK','FAVORITE','RESUME']
    },
}, {
    timestamps: true
});

librarySchema.path('chapter').default(null);

librarySchema.method({
    transform() {
        const transformed = {};
        //, 'updatedAt', 'user', 'createdAt''user', 
        const fields = ['id', 'subscription', 'chapter',"story",'status','timeInSec', 'time', 'type','createdAt'];

        fields.forEach((field) => {
            if (field === 'createdAt' && this[field]) {
                // Format the createdAt date using toLocaleDateString()
                transformed[field] = format(this[field], 'dd-MM-yyyy');
            } else {
                transformed[field] = this[field];
            }
        });

        return transformed;
    },
})

librarySchema.statics = {

    async getUserSpendingDataByMonth() {
        try {
            let users;
            const allMonths = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            const allCombinations = [];
            const currentYear = new Date().getFullYear();

            allMonths.forEach(month => {
                for (let year = currentYear; year <= currentYear; year++) {
                    allCombinations.push({ month, year });
                }
            });

            await this.aggregate([
                {
                    $match: {
                        type: { $in: ['RESUME'] },
                        status : true,
                        createdAt: {
                            $gte: new Date(new Date().getFullYear(), 0, 1),
                            $lt: new Date(new Date().getFullYear(), 12, 31)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $dateToString: { format: '%m', date: '$createdAt' } },
                            year: { $year: '$createdAt' },
                        },
                        spendingTime: { $sum: { $toInt: "$timeInSec" } },
                    }
                },
                {
                    $addFields: {
                        monthName: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$_id.month', '01'] }, then: 'Jan' },
                                    { case: { $eq: ['$_id.month', '02'] }, then: 'Febr' },
                                    { case: { $eq: ['$_id.month', '03'] }, then: 'Mar' },
                                    { case: { $eq: ['$_id.month', '04'] }, then: 'Apr' },
                                    { case: { $eq: ['$_id.month', '05'] }, then: 'May' },
                                    { case: { $eq: ['$_id.month', '06'] }, then: 'Jun' },
                                    { case: { $eq: ['$_id.month', '07'] }, then: 'Jul' },
                                    { case: { $eq: ['$_id.month', '08'] }, then: 'Aug' },
                                    { case: { $eq: ['$_id.month', '09'] }, then: 'Sep' },
                                    { case: { $eq: ['$_id.month', '10'] }, then: 'Oct' },
                                    { case: { $eq: ['$_id.month', '11'] }, then: 'Nov' },
                                    { case: { $eq: ['$_id.month', '12'] }, then: 'Dec' },
                                ],
                                default: 'Unknown'
                            }
                        }
                    }
                },
                
                {
                    $project: {
                        _id: 0,
                        spendingTime: 1,
                        month: '$monthName',
                        year: '$_id.year',
                    }
                },
                {
                    $sort: {
                        'year': 1,
                        'month': 1
                    }
                }
            ]).then((result) => {
                const mergedResult = allCombinations.map(combination => {
                    const match = result.filter(r => r.year === combination.year && r.month == combination.month);
                    if(match.length != 0){
                        return {
                            spendingTime :match.reduce((n, {spendingTime}) => n + spendingTime, 0),
                            month: combination.month, year: combination.year,
                        }
                    }else{
                        return { spendingTime: 0, month: combination.month, year: combination.year};
                    }
                });
                
                
                users = mergedResult;
            })


            return users
        } catch (error) {
            throw new Error(error);
        }
    },
    /**
      * Get Category Type
      *
      * @param {ObjectId} id - The objectId of Category Type.
      * @returns {Promise<User, APIError>}
      */
    async get(id) {
        try {
            let library;
            //user 
            if (mongoose.Types.ObjectId.isValid(id)) {
                library = await this.findById(id).populate('story chapter', 'name image').exec();
            }
            if (library) {
                return library.transform();
            }
            throw new Error(
                'Liberary does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async list({ page = 1, perPage = 50, search, user, status}) {
        let options = omitBy({}, isNil);
        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "type": { $regex: search, $options: 'i' } });
            options.$and = [{ $or: queryArr }];
        }
        options.$and = options.$and || [];
        options.$and.push({ "user": user });
        options.$and.push({ "status": status });
        let libraries = await this.find(options).populate('story chapter', 'name description image')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        libraries = libraries.map(lib => lib.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { libraries, count, pages }

    },
}

module.exports = mongoose.model("Library", librarySchema);