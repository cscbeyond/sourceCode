const PENDING = "pending"; //初始态
const FULFILLED = "fulfilled"; //初始态
const REJECTED = "rejected"; //初始态

function Promise(executor) {
    let self = this; //先缓存this，当前Promise实例
    self.status = PENDING; //设置状态
    // 定义存放成功的回调的数组
    self.onResolvedCallbacks = [];
    // 定义存放失败的回调的数组
    self.onRejectCallbacks = [];

    // 当调用此方法时，如果promise状态为pending的话，可以转成成功态。   如果已经是成功态或失败态，则什么都不做
    function resolve(value) { //2.1.1
        // 如果是初始态，则转成成功态
        if (self.status == PENDING) {
            self.status = FULFILLED;
            self.value = value; //成功后会得到一个值，这个值不能改
            // 调用所有成功地回调
            self.onResolvedCallbacks.forEach(cb => cb(self.value));
        }
    }

    function reject(reason) { //2.1.2
        // 如果是初始态，则转成失败态
        if (self.status == PENDING) {
            self.status = REJECTED;
            self.value = reason; //失败的原因给了value
            // 调用所有失败的回调 
            self.onRejectCallbacks.forEach(cb => cb(self.value));
        }
    }
    try {
        // 因为此函数执行可能会出异常，所以需要捕获。 如果出错了，需要用错误对象reject
        executor(resolve, reject);
    } catch (e) {
        // 如果这个函数执行失败了，则用失败的原因reject这个promise
        reject(e);
    }
}
//onFullfilled是用来接收promise成功地值或失败的原因
// 2.2.1
Promise.prototype.then = function (onFullfilled, onRejected) {
    // 如果成功和失败的回调没有传，则表示这个then没有任何逻辑，只会把值往后抛
    onFullfilled = typeof onFullfilled == 'function' ? onFullfilled : value => value;
    onRejected = typeof onRejected == 'function' ? onRejected : reason => {
        throw reason;
    };
    let self = this;
    let promise2;
    if (self.status == FULFILLED) {
        let x = onFullfilled(self.value);
    }
    if (self.status == REJECTED) {
        let x = onRejected(self.value);
    }
    if (self.status == PENDING) {
        self.onResolvedCallbacks.push(function () {
            let x = onFullfilled(self.value);
        })
        self.onRejectCallbacks.push(function () {
            let x = onRejected(self.value);
        })
    }
}
module.exports = Promise;