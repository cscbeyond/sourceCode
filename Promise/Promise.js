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
        if (value instanceof Promise) {
            value.then(resolve, reject);
        }
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

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        /**  循环引用  不会死循环，但是promise永远都不会完成 
            let p2 = p1.then(function (data) {
                console.log(data);
                return p2;
            })
        */
        return reject(new TypeError('循环引用'));
    }

    let called = false; //promise2是否resolve或reject
    /** if (x instanceof Promise) {
        if (x.status == PENDING) {
            x.then(function (y) {
                resolvePromise(promise2, y, resolve, reject);
            }, reject);
        } else {
            x.then(resolve, reject);
        }
    } else */
    if (x != null && typeof x == 'object' && typeof x == 'function') { // x是一个thenable对象或函数，只要有then方法的就行
        //当我们写的promise和别人写的promise进行交互，编写这段代码时，尽量考虑兼容性，允许别人瞎写。
        try {
            /**
                 let obj = {};
                 Object.defineProperty(obj, then, {
                     get() {
                         throw Error('取then出异常');
                         return function (onFullfilled, onReject) {}
                     },
                     set() {}
                 })
                 obj.then; 
             */
            let then = x.then;
            if (typeof then == 'function') {
                // 有些promise会通话四执行成功或失败的回调

                then.call(x, function (y) {
                    //如果promise2已经成功或失败了，则不要再处理了
                    if (!called) return;
                    called = true;

                    resolvePromise(promise2, y, resolve, reject);
                    resolve(y);
                }, function (err) {
                    if (!called) return;
                    called = true;
                    reject(err);
                });
            } else {
                // 到此 x不是一个thenable对象，那直接把它当成值 resolve promise2就可以了
                resolve(x);
            }
        } catch (error) {
            if (!called) return;
            called = true;
            reject(error);
        }
    } else {
        // 如果x是一个普通的值，则用x的值去resolve promise2
        resolve(x);
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
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(() => {
                try {
                    let x = onFullfilled(self.value);
                    // 如果获取到了返回值x，会走解析promise的过程
                    resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                    // 如果执行成功回调过程中出现异常，用错误原因把promise2 reject
                    reject(error)
                }
            });
        })
    }
    if (self.status == REJECTED) {
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(() => {
                try {
                    let x = onRejected(self.value);
                    resolvePromise(promise2, x, resolve, reject);
    
                } catch (error) {
                    reject(error)
                }
            });
        })
      
    }
    if (self.status == PENDING) {
        return promise2 = new Promise(function (resolve, reject) {
            setTimeout(() => {
                try {
                    let x = onRejected(self.value);
                    resolvePromise(promise2, x, resolve, reject);
    
                } catch (error) {
                    reject(error)
    
                }
            });
    
            self.onResolvedCallbacks.push(function () {
                let x = onFullfilled(self.value);
                resolvePromise(promise2, x, resolve, reject);
            })
            self.onRejectCallbacks.push(function () {
                setTimeout(() => {
    
                });
                let x = onRejected(self.value);
                resolvePromise(promise2, x, resolve, reject);
            })
        })
    }
}

//catch原理就是只传失败的回调
Promise.prototype.catch = function (onReject) {
    this.then(null, onRejected);
}
Promise.deferred = Promise.defer = function () {
    let df = {};
    df.promise = new Promise(function (resolve, reject) {
        df.resolve = resolve;
        df.reject = reject;
    });
    return df;
}
module.exports = Promise;