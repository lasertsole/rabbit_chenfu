const db = require('../db.js')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs-extra')
const FILES_DIR = '../../files/'

/***********************用户上传***********************/
function fileUpload(req) {
    return new Promise(function (resolve, reject) {
        const form = formidable({ hashAlgorithm: 'md5' })
        form.parse(req, (error, fields, files) => {
            if (error) {
                resolve({ error })
                return
            }
            let file = files.file
            let filePath = file.filepath
            let destPath = path.join(FILES_DIR, file.hash + path.extname(file.originalFilename))
            console.log('文件上传：' + destPath)
            fs.move(filePath, destPath, { overwrite: true }, err => {
                // if (err) {//如果文件名字是md5名字形式时失败
                //     return resolve({ error: '上传文件失败' })
                // }
                resolve(file.hash + path.extname(file.originalFilename))
            })
        })
    })
}

module.exports={
    fileUpload,
}


