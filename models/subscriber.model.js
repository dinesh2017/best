const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { omitBy, isNil } = require('lodash');

const subscriberSchema = mongoose.Schema({
    orderId: {
        type: String,
    },
    subscription: {
        type: Schema.Types.ObjectId,
        ref: "Subscription"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    coupan: {
        type: Schema.Types.ObjectId,
        ref: "Coupan"
    },
    price: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    total: {
        type: Number,
    },
    expiryDate: {
        type: Date,
    },
    orderDate: {
        type: Date,
    },
    paymentStatus: {
        type: String,
    },
    activePlan: {
        type: Boolean,
        default:true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
})

subscriberSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'orderId', 'subscription', 'user', 'coupan', 'price', 'discount', 'total', 'orderDate', 'paymentStatus', 'createdBy', 'updatedBy', 'updatedAt', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
})


subscriberSchema.statics = {
    async getTotalAmount() {
        let totalSum = 0; let lastMonthTotalSum = 0; let thisMonthTotalSum = 0;
        try {
            const lastMonthStart = new Date();
            lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
            lastMonthStart.setHours(0, 0, 0, 0);
            lastMonthStart.setDate(1)
            const lastMonthEnd = new Date();
            lastMonthEnd.setDate(1)
            lastMonthEnd.setHours(23, 59, 59, 999);
            lastMonthEnd.setDate(lastMonthEnd.getDate() - 1)

            const thisMonthStart = new Date();
            thisMonthStart.setHours(0, 0, 0, 0);
            thisMonthStart.setDate(1)
            const thisMonthEnd = new Date();
            thisMonthEnd.setMonth(lastMonthStart.getMonth() + 1)
            thisMonthEnd.setDate(1)
            thisMonthEnd.setHours(23, 59, 59, 999);
            thisMonthEnd.setDate(thisMonthEnd.getDate() - 1)


            const pipeline = [
                {
                    $match: {
                        paymentStatus: { $in: ['SUCCESS'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSum: { $sum: '$total' },
                        lastMonthTotalSum: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $and: [
                                            { $gte: ['$createdAt', lastMonthStart] },
                                            { $lte: ['$createdAt', lastMonthEnd] },
                                        ],
                                    },
                                    then: '$total',
                                    else: 0,
                                },
                            },
                        },
                        thisMonthTotalSum: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $and: [
                                            { $gte: ['$createdAt', thisMonthStart] },
                                            { $lte: ['$createdAt', thisMonthEnd] },
                                        ],
                                    },
                                    then: '$total',
                                    else: 0,
                                },
                            },
                        },
                    },
                }];
            const result = await this.aggregate(pipeline).exec();

            if (result.length != 0) {
                totalSum = result[0].totalSum;
                lastMonthTotalSum = result[0].lastMonthTotalSum
                thisMonthTotalSum = result[0].thisMonthTotalSum
            }

            return { totalSum, lastMonthTotalSum, thisMonthTotalSum };
        } catch (error) {
            throw new Error(error);
        }
    },
    
    async getUserData() {
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
                        paymentStatus: { $in: ['SUCCESS','FREE'] },
                        activePlan : true,
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
                            subscription: '$subscription'
                        },
                        totalUsers: { $sum: 1 },
                    }
                },
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: '_id.subscription',
                        foreignField: '_id',
                        as: 'subscriptionDetails'
                    }
                },
                {
                    $unwind: '$subscriptionDetails'
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
                        totalUsers: 1,
                        month: '$monthName',
                        year: '$_id.year',
                        subscription:'$subscriptionDetails.name',
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
                            totalUsers :match.reduce((n, {totalUsers}) => n + totalUsers, 0),
                            month: combination.month, year: combination.year,
                            subscriptions:match
                        }
                    }else{
                        return { totalUsers: 0, month: combination.month, year: combination.year, subscriptions:[] };
                    }
                });
                
                
                users = mergedResult;
            })


            return users
        } catch (error) {
            throw new Error(error);
        }
    },
    async groupByUser() {
        try {
            let subscribe;
            const result = await this.aggregate([
                {
                    $group: {
                        _id: '$user',
                        count: { $sum: 1 },
                    },
                },
            ]).exec();
            if (result)
                subscribe = result;
            return subscribe;
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
            let subscribe;
            if (mongoose.Types.ObjectId.isValid(id)) {
                subscribe = await this.findById(id)
                    .populate({
                        path: "subscription",
                        select: "name duration price"
                    })
                    .populate({
                        path: "coupan",
                        select: "name discount"
                    })
                    .populate('subscription user  createdBy updatedBy', 'name').exec();
            }
            if (subscribe) {
                return subscribe.transform();
            }
            throw new Error(
                'Category does not exist',
            );
        } catch (error) {
            throw new Error(error);
        }
    },

    async list({ page = 1, perPage = 50, search }) {
        let options = omitBy({}, isNil);
        if (search && search.length > 0) {
            let queryArr = []
            queryArr.push({ "name": { $regex: search, $options: 'i' } })
            options = { $and: [options, { $or: queryArr }] }
        }

        let subscribers = await this.find(options)
            .populate({
                path: "subscription",
                select: "name duration price"
            })
            .populate({
                path: "coupan",
                select: "name discount"
            })
            .populate('user createdBy updatedBy', 'name')
            .sort({ seqNumber: 1 })
            .skip(perPage * (page * 1 - 1))
            .limit(perPage * 1)
            .exec();
        subscribers = subscribers.map(subscribe => subscribe.transform())
        var count = await this.find(options).exec();
        count = count.length;
        var pages = Math.ceil(count / perPage);

        return { subscribers, count, pages }

    },
}

module.exports = mongoose.model("Subscriber", subscriberSchema);