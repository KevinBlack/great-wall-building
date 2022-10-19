<template>
    <div>
        <el-select v-model="dictValue" v-bind="$attrs" clearable @change="change" class="w-100">
            <el-option v-for="(item, index) in dictArr" :label="item.label" :key="index" :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { dict } from '@/libs'
export default {
    model: {prop: 'value',event: 'change'},
    name: 'DictSelect',
    props: {
      value: String,
      /**
       * String:词典格式
       * Array:[{key:'',val:'}] || ['val','val']格式
       */
      selectData: { type: [Array, String], required: true },
      showContents: { type: Array },
    },
    data() {
      return {
        dictArr: []
      }
    },
    computed: {
      dictValue: {
        get() {
          return this.value
        },
        set(val) {}
      }
    },
    // watch: {
    //   selectData(val) {
    //     this.initDictArr()
    //   }
    // },
    methods: {
      change(item) {
        this.dictValue = item
        this.$emit('change', item)
      },
      initDictArr() {
        if (typeof this.selectData == 'string') {
          dict.dict(this.selectData).then(payload => {
            if(this.showContents) this.dictArr = payload.filter(item => this.showContents.contains(item.value))
            else this.dictArr = payload
          })
        } else {
          if(this.showContents) this.dictArr = this.selectData.filter(item => this.showContents.contains(item.value))
          else this.dictArr = this.selectData
        }
      }
    },
    created() {
      this.initDictArr()
    }
}
</script>

<style>

</style>
