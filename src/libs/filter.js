export default {
    'dateFormat' (dateTime, fmt) {
        if(dateTime){
            let date = new Date()
            //ios new Date()需要把'-'转换成'/'
            if(typeof dateTime === 'object' || typeof dateTime === 'number') date = new Date(dateTime)
            else {
                date = typeof dateTime === 'string'&&dateTime.split('-').length===1?new Date(parseInt(dateTime)) : new Date(dateTime.replace(/-/g, "/"))
            }
            fmt = fmt?fmt:'yyyy-MM-dd hh:mm'
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            let o = {
                'yyyy':date.getYear(),
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };
            for (let k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    let str = o[k] + '';
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
                }
            }
            return fmt
        }else {
            return '--'
        }
    },
    'findNameFromList' (dictList, code) {
        if(code) {
            if(dictList.find(item => item.value === code.toString())) {
                return dictList.find(item => item.value === code.toString()).label
            }else {
                return '--'
            }
        }
    },
    //任务状态
    'getServeStatus' (type) {
        if ("1001" == type) {
            return '待受理';
        } else if ("1002" == type) {
            return '待核实';
        } else if ("1003" == type) {
            return '待支付';
        } else if ("1004" == type) {
            return '待派工';
        } else if ("1005" == type) {
            return '待办结';
        } else if ("1006" == type) {
            return '已办结';
        } else if ("1007" == type) {
            return '已评价';
        } else if ("1008" == type) {
            return '重新派工';
        } else if ("1009" == type) {
            return '取消服务';
        } else {
            return '';
        }
    }
}
