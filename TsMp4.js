const fs = require('node:fs');

const child_process = require('node:child_process');

let reqDir = {
    targetDir: null,
    mp4: () => `${getTargetDirPath()}\\mp4`,
    tempCopyTs: () => `${getTargetDirPath()}\\tempCopyTs`,
}

function getTargetDirPath() {
    return reqDir.targetDir;
}


function getTargetDir() {
    console.log(getTargetDirPath());
    return fs.opendirSync(getTargetDirPath());
}


function getCommandList(filename) {
    let commands = [];

    const filepath = `${getTargetDirPath()}\\${filename}.ts`;

    const tempFileCopyPath = `${reqDir.tempCopyTs()}\\${filename}_copy.ts`;

    const mp4Filepath = `${reqDir.mp4()}\\${filename}.mp4`;

    commands.push(`ffmpeg -i "${filepath}" -c copy "${tempFileCopyPath}"`);
    commands.push(`ffmpeg -i "${tempFileCopyPath}" -c copy "${mp4Filepath}"`);

    console.log(commands);

    return commands;
}


function createReqDirectory() {
    let tempCopyTsDir, mp4;
    try {
        tempCopyTsDir = fs.opendirSync(reqDir.tempCopyTs());
    } catch (err) {
        if (!tempCopyTsDir) {
            fs.mkdirSync(reqDir.tempCopyTs());
        }
    }

    try {
        mp4 = fs.opendirSync(reqDir.mp4());
    } catch (err) {
        if (!mp4) {
            fs.mkdirSync(reqDir.mp4());
        }
    }
}


function executeCommands(commands) {
    createReqDirectory();

    //executing command[0]
    console.log(commands[0]);


    try {
        child_process.execSync(commands[0], { cwd: getTargetDirPath() });

        //executing command[1]
        console.log(commands[1]);

        try {
            child_process.execSync(commands[1], { cwd: getTargetDirPath() });

            console.log('success');
        } catch (err) {

        }
    } catch (err) {

    }
}


function getTsFilesInDir() {
    let dirent;
    let filename;
    let commands;

    const targetDir = getTargetDir();

    while (true) {
        dirent = targetDir.readSync();

        if (dirent === null) break;

        if (!dirent.name.endsWith('.ts')) continue;

        filename = dirent.name.split('.ts')[0];

        commands = getCommandList(filename);

        executeCommands(commands);

        //break;
    }
}


function run() {
    reqDir.targetDir = 'E:\\tsvids';
    Object.freeze(reqDir);
    getTsFilesInDir();
}


run();
