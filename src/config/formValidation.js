const formValidation = {
    mobile: (rule, value, callback) => {
        // const reg = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/
        const reg = /^1(3|4|5|7|8)\d{9}$/;
        if(!reg.test(value)) {
            callback('请输入正确的手机号')
        }else {
            callback()
        }
    },
    plateNum:(rule, value, callback) => {
        if(value==""||value==undefined){
            callback()
            return false
        }
        // const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        // if(!reg.test(value)) {
        //     callback('请输入正确的车牌号码')
        // }else {
        //     callback()
        // }
        const xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}$/;

        const creg=
                   /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
                //    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
        if(value.length == 7){
            if(!xreg.test(value.substr(0,2))) {
                callback('请输入正确的车牌号码')
            }else{
            	 callback()
            }
        } else if(value.length == 8){
            if(!xreg.test(value.substr(0,2))) {
                callback('请输入正确的车牌号码')
            }else{
            	 callback()
            }
        } else{
            callback('请输入正确的车牌号码')
        }
    },
    age: (rule, value, callback) => {
        const reg =/^[0-9]*[1-9][0-9]*$/
        if(!(reg.test(value) || (Number(value) === 0))) {
            callback('请输入大于等于0的整数')
        }else {
            callback()
        }
    },
    

}

export default formValidation
