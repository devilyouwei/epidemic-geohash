const n = 14
const Pd = 45
const Pw = 15
const data = require('./data.json')

// 28天感染情况example
let Rw = data.w
let Rd = data.d
const len = Rw.length
console.log('Total data:')
console.log(Rw.length)
console.log(Rd.length)
let Ro = []
let Rall = 0 //所有人数
let ASI = []

console.log('start---------------------------------------')
for (let i = 0; i < len; i++) {
    let sign = random(0, 1)
    Ro.push(random(500, 1000)) // 随即普通人
    let j = i
    console.log('day:' + j)
    console.log('danger:' + Rd[i])
    console.log('warning:' + Rw[i])
    let RI = 0
    while (j >= 0 && i - j + 1 <= n) {
        let asi = ASI[j - 1] //前一天的ASI
        if (j == 0) asi = 100
        asi < 60 ? (Rall = Rall) : (Rall = Ro[j] + Rw[j] + Rd[j]) //last ASI< 60 lockdown
        RI += ((Rd[j] * Pd) / Rall + (Rw[j] * Pw) / Rall) * ((100 * (j + 1)) / (((i + 1 + 1) * (i + 1)) / 2))
        j--
    }
    asi = 100 - RI < 0 ? 0 : 100 - RI
    ASI.push(asi)
    console.log('RISK: ' + RI)
    console.log('ASI: ' + ASI[i])
    console.log('---------------------------------------')
}
console.log(Rd)
console.log(Rw)
console.log(ASI)

function random(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10)
            break
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
            break
        default:
            return 0
            break
    }
}
