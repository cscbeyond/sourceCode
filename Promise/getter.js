let obj = {};
Object.defineProperty(obj, then, {
    get() {
        throw Error('取then出异常');
        return function (onFullfilled, onReject) {}
    },
    set() {}
})
obj.then;