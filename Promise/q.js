// 这个模块是用来实现promise，在angular.js里的promise就是用的q
// let Q = require('q');

let Q = {
    defer() {
        let success, error;
        return {
            resolve(data) {
                success(data)
            },
            reject(err) {
                error(err)
            },
            promise: {
                then(onFullfilled, onRejected) {
                    success = onFullfilled;
                    error = onRejected;
                }
            }
        }
    }
}

let fs = require('fs');

function readFile(fileName) {
    let defer = Q.defer();
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(data);
        }
    })
    return defer.promise;
}

readFile(__dirname + '/1.txt').then(function (data) {
    console.log(data);
}).catch(function (err) {
    console.log(err);
})