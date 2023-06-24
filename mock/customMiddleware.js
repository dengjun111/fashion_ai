const tasks = {};

const submitImagine = (req, res) => {
    const taskId = Date.now();
    tasks[taskId] = {
        status: 'SUBMITTED',
    };


    setTimeout(() => {
        let newTask = {
            ...tasks[taskId],
            status: 'IN_PROGRESS',
            progress: 0,
            imageUrl: 'https://cdn.discordapp.com/attachments/1091550235068747820/1121778930211373096/ericdengjun_2375913722439105_2b64023d-87d1-4db9-af44-f4f327798232.png'
        }
        tasks[taskId] = newTask;
        let progressInterval = setInterval(() => {
            if (newTask.progress < 100) {
                newTask.status = 'IN_PROGRESS';
                newTask.progress += 5;
                tasks[taskId] = newTask;
            } else {
                clearInterval(progressInterval);
                newTask.status = 'SUCCESS';
                newTask.imageUrl = 'https://cdn.discordapp.com/attachments/1091550235068747820/1121784349960978462/ericdengjun_1800261017132781_a_womans_Down_Jacket_white_backgro_a970041f-6e5b-4c3e-891c-f709101c5baa.png';
                tasks[taskId] = newTask;
            }
        }, 5000);
    }, 60 * 1000);
    res.send({ code: 1, status: "SUBMITTED", result: taskId });
};

const fetchTask = (req, res) => {
    const taskId = req.params.taskId;
    const task = tasks[taskId];

    if (!task) {
        res.status(404).send({ error: 'Task not found' });
    } else {
        if (task.status === 'SUBMITTED') {
            res.send({ code: 1, status: task.status, result: taskId });
        } else {
            res.send({ code: 1, progress: task.progress + "%", status: task.status, imageUrl: task.imageUrl })
        }
    }
};

module.exports = (req, res, next) => {
    if (req.method === 'POST' && req.path === '/mj/submit/imagine') {
        submitImagine(req, res);
    } else if (req.method === 'GET' && req.path.startsWith('/mj/task/') && req.path.endsWith('/fetch')) {
        req.params = {
            taskId: req.path.split('/')[3],
        };
        fetchTask(req, res);
    } else {
        next();
    }
};