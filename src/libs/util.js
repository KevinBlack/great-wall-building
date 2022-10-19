import Vue from 'vue'
const util = {
    // 生成随机uuid
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
        });
    },
    getTime(n){
        let now=new Date();
        let year=now.getFullYear();
        //因为月份是从0开始的,所以获取这个月的月份数要加1才行
        let month=now.getMonth()+1;	
        let date=now.getDate();
        let day=now.getDay();
        //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
        if(day!==0){
            n=n+(day-1);
        }
        else{
            n=n+day;
        }
        if(day){
            //这个判断是为了解决跨年的问题
            if(month>1){
                month=month;
            }
            //这个判断是为了解决跨年的问题,月份是从0开始的
            else{
                year=year-1;
                month=12;
            }
        }
        now.setDate(now.getDate()-n);	
        year=now.getFullYear();
        month=now.getMonth()+1;
        date=now.getDate();
        let s=year+"-"+(month<10?('0'+month):month)+"-"+(date<10?('0'+date):date);
        return s;
    },
    //  参数分别为日期对象，增加的类型，增加的数量
    dateAdd(date, key, Number) {
        switch (key) {
        case 's':
            return new Date(Date.parse(date) + (1000 * Number));
        case 'n':
            return new Date(Date.parse(date) + (60000 * Number));
        case 'h':
            return new Date(Date.parse(date) + (3600000 * Number));
        case 'd':
            return new Date(Date.parse(date) + (86400000 * Number));
        case 'w':
            return new Date(Date.parse(date) + ((86400000 * 7) * Number));
        case 'M':
            return new Date(date.getFullYear(), date.getMonth() + Number, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        case 'y':
            return new Date(date.getFullYear() + Number, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        }
    },
    //返回该月的第一天和最后一天
    getFirstAndLast(time) {
        let dateTime = Vue.filter('dateFormat')(time,'yyyy-MM')
        let year=dateTime.split('-')[0]
        let month=dateTime.split('-')[1]
        return [new Date(year,month-1,1),new Date(year,month,0)]
    },
    // 扁平化数组
    flattenArray(arr){
        let _arr = []
        for (let i = 0; i < arr.length; i++) {
            if (!Array.isArray(arr[i])) {
                _arr.push(arr[i])
            } else {
                _arr = _arr.concat(this.flattenArray(arr[i]))
            }
        }
        return _arr
    }
}

export default util