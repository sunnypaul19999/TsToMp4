const { opendir } = require('node:fs/promises');

const child_process = require('node:child_process');
const { stderr } = require('node:process');

function getCommandList(filepath) {
    let commands = [];
    commands.push(`ffmpeg -i "${filepath}.ts" -c copy "${filepath} copy.ts"`);
    commands.push(`ffmpeg -i "${filepath} copy.ts" -c copy "${filepath}.mp4"`);

    //console.log(commands);

    return commands;
}

function getTargetDir(dirPath) {
    return opendir(dirPath);
}

function executeCommands(dirPath, commands) {
    //executing command[0]
    console.log(commands[0]);

    try {
        child_process.execSync(commands[0], { cwd: dirPath });

        //executing command[1]
        console.log(commands[1]);

        try {
            child_process.execSync(commands[1], { cwd: dirPath });
            
            console.log('success');
        } catch (err) { 

        }
    } catch (err) {

    }
}

async function getTsFilesInDir(dirPath) {
    let dirent;
    let commands;

    const targetDir = await getTargetDir(dirPath);

    while (true) {
        dirent = await targetDir.read();

        if (dirent === null) break;

        if (!dirent.name.endsWith('.ts')) continue;

        commands = getCommandList(`${dirPath}\\${dirent.name.split('.ts')[0]}`);

        executeCommands(dirPath, commands);

        break;
    }
}

console.log(process.cwd());
getTsFilesInDir('E:\\tsvids');
