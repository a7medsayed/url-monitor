const checkEntity = require("../models/check");
const checkLogEntity = require("../models/checkLog");
const {
    getChecksByTag
} = require("./checkService");

const getCheckUptimes = async (checkId) => {
    const uptimesResult = await checkLogEntity.aggregate([{
            $match: {
                status: 'up',
                checkId: checkId

            }
        },
        {
            $group: {
                _id: {
                    checkId: '$checkId'
                },
                upTimes: {
                    '$sum': 1
                }
            }

        }
    ]);
    return uptimesResult.length > 0 ? uptimesResult[0].upTimes : 0;;
}
const gettotalChecktimes = async (checkId) => {
    const totalChecksTimesResult = await checkLogEntity.aggregate([{
            $match: {

                checkId: checkId

            }
        },
        {
            $group: {
                _id: {
                    checkId: '$checkId'
                },
                totalchecTimes: {
                    '$sum': 1
                }
            }

        }
    ]);
    return totalChecksTimesResult.length > 0 ? totalChecksTimesResult[0].totalchecTimes : 0;

}
const getCheckDowntimes = async (checkId) => {
    const downtimesResult = await checkLogEntity.aggregate([{
            $match: {
                status: 'down',
                checkId: checkId

            }
        },
        {
            $group: {
                _id: {
                    checkId: '$checkId'
                },
                downTimes: {
                    '$sum': 1
                }
            }

        }
    ]);
    return downtimesResult.length > 0 ? downtimesResult[0].downTimes : 0;

}
const getCheckAvgResponseTime = async (checkId) => {
    const avgResponseTimeResult = await checkLogEntity.aggregate([{
            $match: {

                checkId: checkId

            }
        },
        {
            $group: {
                _id: {
                    checkId: '$checkId'
                },
                avgResponseTime: {
                    '$avg': '$responseTime'
                }
            }

        }
    ]);
    return (avgResponseTimeResult.length > 0 ? avgResponseTimeResult[0].avgResponseTime : 0) + ' ms';

}
const getCheckHistory = async (checkId) => {
    const history = await checkLogEntity.aggregate([{
            $match: {

                checkId: checkId

            }
        },
        {
            $project: {
                _id: 0,
                requestedAt: '$createdAt'
            }

        }
    ]);
    return history.map((hist) => hist.requestedAt);
}

const buildCheckReport = async (check) => {
    const currentStatus = check.lastStatus;

    const uptimes = await getCheckUptimes(check._id.toString('hex'));

    const downtimes = await getCheckDowntimes(check._id.toString('hex'));

    const totalChecksTimes = await gettotalChecktimes(check._id.toString('hex'));

    const availability = (uptimes / totalChecksTimes) * 100 + ' %';


    const avgResponseTime = await getCheckAvgResponseTime(check._id.toString('hex'));


    const historyLog = await getCheckHistory(check._id.toString('hex'));

    var upAndDownTime = await getUpandDownTimesInSec(check._id.toString('hex'));


    return {
        id: check._id.toString('hex'),
        url: check.url,
        currentStatus,
        availability,
        ...upAndDownTime,
        outages: downtimes,
        responseTime: avgResponseTime,
        history: historyLog,

    };


}
const getCheckReport = async (userId) => {
    const userChecks = await checkEntity.find({
        userId
    });
    const report = [];
    for (const check of userChecks) {
        const checkReport = await buildCheckReport(check);
        report.push(checkReport);
    }
    return report;
}
const getUpandDownTimesInSec = async (checkId) => {
    var upAndDownTimeResult = await checkLogEntity.aggregate([{
            $match: {
                checkId: checkId
            }
        },
        {
            $project: {
                _id: 0,
                requestedAt: '$createdAt',
                status: 1
            }

        },
        {
            $sort: {
                requestedAt: 1
            }
        }

    ]);
    var upTime = 0;
    var downTime = 0;

    for (let i = 1; i < upAndDownTimeResult.length; i++) {

        if (upAndDownTimeResult[i].status == 'up') {
            upTime += ((new Date(upAndDownTimeResult[i].requestedAt).getTime() / 1000) -
                (new Date(upAndDownTimeResult[i - 1].requestedAt).getTime() / 1000));
        } else {
            downTime += ((new Date(upAndDownTimeResult[i].requestedAt).getTime() / 1000) -
                (new Date(upAndDownTimeResult[i - 1].requestedAt).getTime() / 1000));

        }


    }

    return {
        upTime,
        downTime
    };
}
const getCheckReportByTag = async (userId, tag) => {
    const userChecks = await getChecksByTag(userId, tag);
    const report = [];
    for await (const check of userChecks) {
        const checkReport = await buildCheckReport(check);
        report.push(checkReport);
    }
    return report;
}

module.exports = {
    getCheckReportByTag,
    getCheckReport
};