let fs = require('fs');
// let co = require('co');

function readFile(fineName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fineName, 'utf8', function (err, data) {
            err ? reject(err) : resolve(data);
        })
    })
}

function* read() {
    console.log('开始');
    let a = yield readFile(__dirname + '/1.txt');
    console.log(a);

    let b = yield readFile(__dirname + '/2.txt');
    console.log(b);

    let c = yield readFile(__dirname + '/3.txt');
    console.log(c);

    return c;

}
// 调用生成器，返回迭代器
let it = read();
let r1 = it.next();

/**
r1.value.then(function (data) {
    let r2 = it.next(data);
    r2.value.then(function (data) {
        let r3 = it.next(data);
        r3.value.then(function (data) {
            console.log(data);
            let r4 = it.next(data);
            console.log(r4);
        })
    })
})
*/

// co 帮我们自动执行迭代器
function co(gen) {
    let it = gen(); // 我们要让我们的生成器持续执行
    return new Promise(function (resolve, reject) {
        ! function next(lastVal) {
            let {
                value,
                done
            } = it.next(lastVal);
            if (done) {
                resolve(value);
            } else {
                value.then(next, reject);
            }
        }()
    })
}

co(read);