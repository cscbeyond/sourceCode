let p1 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve(100)
    }, 1000);
})

let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve(200)
    }, 2000);
});

/** 
Promise.all // 会接收一个promise数组，如果promise全部完成了，这个promise才会成功,如果有一个失败，那么整个Promise就失败了
Promise.race //会接收一个promise数组，只要有一个成功了，这个promise就会成功。只有一个失败，那么整个Promise就失败了
*/
console.time('cost');
/** 
 * 同时异步请求多个数据的时候，会用all
Promise.all([p1, p2]).then(function (data) {
    console.log(data);
    console.timeEnd('cost');  //cost: 2秒
})
*/

/**
 * 当有多个接口都不稳定，可以同时取三个接口，哪个先回来用哪个。

 */
Promise.race([p1, p2]).then(function (data) {
    console.log(data);
    // console.timeEnd('cost'); //cost: 1秒
}, function (err) {
    console.log(err);
    console.timeEnd('cost'); //cost: 1秒

})

