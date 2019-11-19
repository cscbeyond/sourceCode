let MyPromise = require('./Pormise');
let p1 = new MyPromise(function (resolve, reject) {
    setTimeout(() => {
        let num = Math.random();
        if (num < 0.5) {
            resolve(num);
        } else {
            reject('失败');
        }
    });
});

// p1.then(function (data) {
//     console.log(data);
// }, function (err) {
//     console.log(er);
// })
//这个叫值得穿透
let p2 = p1.then(function (data) {
    return data
});
p2.then(function (data) {
    console.log(data);

}, function (reason) {
    console.log(reason);
})