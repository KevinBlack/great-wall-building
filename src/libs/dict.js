import axiosHttp from './axiosHttp'
const dict = {
    dict(dictName) {
        return axiosHttp.post('/system/user/dict/findListByType', {typekey: dictName}).then(res => {
            if(res) {
                const arr = res.map(item => item = {label: item.name,value: item.code})
                return arr
            }
        })
    }
}

export default dict