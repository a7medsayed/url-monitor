const checkEntity = require("../models/check");
const checkLogEntity = require("../models/checkLog");
const axios = require("axios");
const cron = require("node-cron");
var tasks = [];
const {
    sendUrlStatusEmail
} = require("./emailService");
const {
    findById
} = require("./userService");

const addCheck = async (check) => {
    const savedCheck = await checkEntity.create(check);
    restartTasks();
    return savedCheck;
};

const editCheck = async (id, data) => {
    await checkEntity.updateOne({
        _id: id
    }, data);
    restartTasks();
};

const logCheck = async (checkId, status, responseTime, tags, userId) => {
    const checkLog = {
        checkId,
        userId,
        tags,
        status,
        responseTime,
    };
    await checkLogEntity.create(checkLog);
}
const restartTasks = async () => {
    tasks = [];
    const checks = await getAllChecks();
    for (const check of checks) {
        const task = {
            id: check._id,
            job: cron.schedule(`${check.interval} * * * * *`, () => {
                console.log(check._id);
                crawl(check);
            }),
        };

        tasks.push(task);
    }
};

const startTasks = async () => {
    const checks = await getAllChecks();
    for (const check of checks) {
        const task = {
            id: check._id,
            job: cron.schedule(`${check.interval} * * * * *`, () => {
                console.log(check._id);
                crawl(check);
            }),
        };

        tasks.push(task);
    }

    //    const t = {id: 1,
    //     tk: cron.schedule('* * * * * *', () => {
    //         console.log(1);
    //       })
    // }
    // const t2 = {id: 2,
    //     tk: cron.schedule('* * * * * *', () => {
    //         console.log(2);
    //       })
    // }
    // tasks.push(t);
    // tasks.push(t2);
    // for(const task of tasks)
    // {
    //     task.tk.start();
    // }
};
const pause = async (id) => {
    const task = tasks.filter((t) => {
        return t.id == id;
    });

    task[0].job.stop();

    const check = await checkEntity.findOne({
        _id: id
    });
    check.state = "paused";

    await editCheck(check.id, {
        state: check.state
    });
    console.log("check paused");
    restartTasks();
};

const resume = async (id) => {
    const task = tasks.filter((t) => {
        return t.id == id;
    });

    task[0].job.start();

    const check = await checkEntity.findOne({
        _id: id
    });
    check.state = "running";
    await editCheck(check.id, {
        state: check.state
    });
    console.log("check running");
    restartTasks();
};

const crawl = async (check) => {
    if (check.state == 'paused') {
        return;
    }
    const response = await checkState(check.url, "get");
    const Status = response.statusCode == 200 ? "up" : "down";
    //log 
    await logCheck(check.id, Status, response.responseTime, check.tags, check.userId);

    if (check.lastStatus != Status) {
        //updateLastStatus
        check.lastStatus = Status;
        await editCheck(check.id, {
            lastStatus: check.lastStatus
        });

        const user = await findById(check.userId);

        //send email only if status changed.
        sendUrlStatusEmail(user.email, Status, check.url, check.name);
    }
};

const getAllChecks = async () => {
    return await checkEntity.find({});
};
const deleteCheck = async (id, data) => {
    await checkEntity.deleteOne(id);
};
const getChecksByTag = async (userId, tag) => {
    const checks = await checkEntity.aggregate([{
            $unwind: '$tags'
        },
        {
            $match: {

                userId: userId,
                tags: tag
            }
        },
    ]);

    return checks;
};

const checkState = async (url, methods) => {
    const NOT_FOUND = 404;
    return await axios({
            url: url,
            method: methods == "get" ? "GET" : methods == "post" ? "POST" : "DELETE",
            ignoreSSL: true,
        })
        .then((res) => {
            if (!res.status) return {
                statusCode: NOT_FOUND,
                responseTime: res['duration']
            };
            return {
                statusCode: res.status,
                responseTime: res['duration']
            };
        })
        .catch((err) => {
            return {
                statusCode: NOT_FOUND,
                responseTime: 0
            };
        });
};

module.exports = {
    addCheck,
    editCheck,
    deleteCheck,
    checkState,
    getChecksByTag,
    startTasks,
    pause,
    resume,
};