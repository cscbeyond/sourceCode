/**
 * async await 是异步终极解决方案
 * 实际上 是generator+promise的语法糖
 */

let fs = require('fs');
let co = require('co');

// function readFile(fineName) {
//     return new Promise(function (resolve, reject) {
//         fs.readFile(__dirname + '/' + fineName, 'utf8', function (err, data) {
//             throw Error('异常')
//             err ? reject(err) : resolve(data);
//         })
//     })
// }
/**
 * 1.简洁
 * 2.有很好的语义
 * 3.可以很好的处理异常 throw error return try catch
 * koa2已支持async/await
 */
/*
async function read() {
    // await后面必须跟一个promise
    let a = await readFile('./1.txt');
    console.log(a);

    let b = await readFile('./2.txt');
    console.log(b);

    let c = await readFile('./3.txt');
    console.log(c);
    return 'ok';
}
read().then(data => {
    console.log(data);
});

*/
// async await 是语法糖 内部使用generator+promise实现

let Promise = require('bluebird');
let readFile = Promise.promisify(fs.readFile);

async function read() {
    let a = await readFile(__dirname + '/1.txt', 'utf8');
    console.log(a);
    let b = await readFile(__dirname + '/2.txt', 'utf8');
    console.log(b);
    let c = await readFile(__dirname + '/3.txt', 'utf8');
    console.log(c);
    return 'ok';
};
read().then(data => {
    console.log(data);
});