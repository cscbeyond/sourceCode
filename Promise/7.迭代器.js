// let arr = [1, 2];
// for (let item of arr) {
//     console.log(item);
// };


// 深度克隆
// JSON方法不支持函数及正则的克隆

let obj = {
    age: 4,
    hobby: [1, 2, 3],
    getAge() {
        console.log(this.age);
    },
    home: {
        city: 'bj'
    }
}
let obj2 = deepClone(obj);
obj2.age = 10;
obj2.hobby.push(4);
obj2.home.city = 'shanghai';
console.log(obj2);
console.log(obj);

function deepClone(parent, child) {
    child = child ? child : {};
    for (let key in parent) {
        if (parent.hasOwnProperty(key)) {
            if (typeof parent[key] == 'object') {
                child[key] = Object.prototype.toString.call(parent[key]) == '[object Object]' ? {} : [];
                deepClone(parent[key], child[key]);
            } else {
                child[key] = parent[key];
            }
        }
    }
    return child;
}