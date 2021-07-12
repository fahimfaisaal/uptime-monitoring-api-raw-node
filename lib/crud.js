const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');

const { isFunction } = require('./util');

const dataStoragePath = path.resolve('.data');

// create directory if it's not exist
exports.createDir = async (dir, callback) => {
    try {
        const dirPath = path.join(dataStoragePath, dir);
        const successMessage = `new ${path.dirname(dirPath)} has created!`;

        if (!fs.existsSync(dirPath)) {
            await fsPromise.mkdir(dirPath);

            isFunction(callback) && callback(null, successMessage);
        }
    } catch (err) {
        isFunction(callback) && callback(err, null);
    }
}

// create a file if it's doesn't exist
exports.createFile = async (dir, filename, data, callback) => {
    try {
        const filePath = path.join(dataStoragePath, dir, filename + '.json');
        const successMessage = `${path.basename(filePath)} has created successfully.`;
        
        // open file
        const fileDescriptor = await fsPromise.open(filePath, 'wx');
        // write file
        await fileDescriptor.write(JSON.stringify(data, null, 2));
        // close file
        await fileDescriptor.close();
        // response back
        isFunction(callback) && callback(null, successMessage);
    } catch (err) {
        isFunction(callback) && callback(err, null);
    }
}

// read file if it's exist
exports.readFile = async (dir, fileName, callback) => {
    try {
        const filePath = path.join(dataStoragePath, dir, fileName + '.json');
        
        // read file by passing path
        const jsonFile = await fsPromise.readFile(filePath);
        const parseFile = JSON.parse(jsonFile);

        isFunction(callback) && callback(null, parseFile); // pass the json file
    } catch (err) {
        isFunction(callback) && callback(err, null);
    }
}

// if it's exist it's can be updatable
exports.updateFile = async (dir, fileName, data, callback) => {
    try {
        const dataToJson = JSON.stringify(data, null, 2);
        const filePath = path.join(dataStoragePath, dir, fileName + '.json');
        const successMessage = `${path.basename(filePath)} has updated successfully.`

        // open the file
        const fileDescriptor = await fsPromise.open(filePath, 'r+');

        await fileDescriptor.write(dataToJson);
        await fileDescriptor.close();

        isFunction(callback) && callback(null, successMessage);
    } catch (err) {
        isFunction(callback) && callback(err, null);
    }
}

// delete file if the file is exist
exports.deleteFile = async (dir, filename, callback) => {
    try {
        const filePath = path.join(dataStoragePath, dir, filename + '.json');
        const successMessage = `${path.basename(filePath)} has deleted.`;

        // delete file
        await fsPromise.unlink(filePath);

        isFunction(callback) && callback(null, successMessage);
    } catch (err) {
        isFunction(callback) && callback(err, null);
    }
}