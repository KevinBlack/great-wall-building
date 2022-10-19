import axiosHttp from './axiosHttp'

const directive = {
    dict(el, binding) {
        if((binding.value || binding.value === 0)&&binding.arg) {
            axiosHttp.post('/system/user/dict/findListByType', {typekey: binding.arg}).then(res => {
                if(res.find(item => item.code === binding.value.toString())) {
                    el.innerHTML = res.find(item => item.code === binding.value.toString()).name
                }
            })
        }
    }
}

export default {
    dict: {
        bind: directive.dict,
        update: directive.dict
    }
}