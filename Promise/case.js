let MyPromise = require('./Promise');
let p1 = new MyPromise(function (resolve, reject) {
    setTimeout(() => {
        let num = Math.random();
        if (num < 0.5) {
            resolve(num);
        } else {
            reject('失败');
        }
    });
    // resolve('xxx');
    // reject('失败');
});

// p1.then(function (data) {
//     console.log(data);
// }, function (err) {
//     console.log(er);
// })
//这个叫值得穿透
// let p2 = p1.then(function (data) {
//     return data
// });
p1.then(function (data) {
    console.log(data);
    // throw Error('成功回调出错了');
}, function (reason) {
    console.log(reason);
})

/**  循环引用
let p2 = p1.then(function (data) {
    console.log(data);
    return p2;
})
*/