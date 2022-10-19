//某个字符串在数组中检验
Array.prototype.contains = function (str) { 
    var index = this.length; 
    while (index--) { 
        if (this[index] === str) { 
            return true; 
        } 
    } 
    return false; 
}