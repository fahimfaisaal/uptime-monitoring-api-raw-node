const fsPromise = require('fs/promises');
const path = require('path');

// relative dependencies
const { isFunction, hash } = require('./util');
const dataStoragePath = path.resolve('.data');

// module scaffolding
const crud = {};

/**
 * create directory if it's not exist
 * @param {String} dir 
 * @param {function} callback 
 */
crud.createDir = async (dir, callback) => {
    const dirPath = path.join(dataStoragePath, dir);
    const createMessage = `new ${path.basename(dirPath)} directory has created!`;
    const alreadyExistMessage = `${path.basename(dirPath)} directory is already exist.`;

    try {
        await fsPromise.access(dirPath);

        // if the file already exists
        isFunction(callback) && callback(alreadyExistMessage);
    } catch {
        // if the file not exists then create one
        await fsPromise.mkdir(dirPath);

        isFunction(callback) && callback(createMessage);
    }
}

/**
 * create a file if it's doesn't exist
 * @param {String} dir 
 * @param {String} filename except extension
 * @param {Object} data 
 * @param {function} callback 
 */
crud.createFile = async (dir, filename, data, callback) => {
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

/**
 * read file if it's exist
 * @param {String} dir 
 * @param {String} fileName except extension
 * @param {function} callback 
 */
crud.readFile = async (dir, fileName, callback) => {
    try {
        const filePath = path.join(dataStoragePath, dir, fileName + '.json');
        
        // read file by passing path
        const jsonFile = await fsPromise.readFile(filePath);
        const parseFile = await JSON.parse(jsonFile);

        isFunction(callback) && callback(null, parseFile); // pass the json file
    } catch (err) {
        isFunction(callback) && callback(err.message, null);
    }
}

/**
 * if it's exist it's can be updatable
 * @param {String} dir 
 * @param {String} fileName except extension
 * @param {Object} data 
 * @param {function} callback 
 */
crud.updateFile = (dir, fileName, newData, reqMethod, callback) => {
    try {
        let oldData = {};

        const readFileResolver = new Promise((resolve, reject) => {
            crud.readFile(dir, fileName, (err, data) => {
                if (!err) {
                   return resolve(data)
                }

                return reject(null)
            })
        })

      readFileResolver
          .then(data => {
            oldData = reqMethod === 'patch' ? data : {};
            // if password in newData then it will be hash
            if ('password' in newData) {
                newData.password = hash(newData.password);
            }
            
            // bind new data and old data
            const bindOldAndNewData = {
                ...oldData,
                ...newData
            }
    
            const convertToJson = JSON.stringify(bindOldAndNewData, null, 2);
            const filePath = path.join(dataStoragePath, dir, fileName + '.json');
            const successMessage = `${path.basename(filePath)} has updated successfully.`;

            (async () => {
                await fsPromise.writeFile(filePath, convertToJson);

                isFunction(callback) && callback(null, successMessage);
            })()
          }).catch(err => {
            isFunction(callback) && callback(err, `${fileName} doesn't exist!`)
        })
    } catch (err) {
        isFunction(callback) && callback(err, null);
    }
}

/**
 * delete file if the file is exist
 * @param {String} dir 
 * @param {String} filename except extension
 * @param {*} callback 
 */
crud.deleteFile = async (dir, filename, callback) => {
    try {
        const filePath = path.join(dataStoragePath, dir, filename + '.json');
        const successMessage = `${path.basename(filePath)} has deleted.`;

        // delete file
        await fsPromise.unlink(filePath);

        isFunction(callback) && callback(null, successMessage);
    } catch (err) {
        isFunction(callback) && callback(err.message, null);
    }
}

module.exports = crud