 function isNumber(val) {
  var regPos = /^[1-9]+[0-9]*$/ ; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

function getCurrentTime(){
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  if (h.toString().length < 2) h = "0"+h;
  if (m.toString().length < 2) m = "0"+m;
  if (s.toString().length < 2) s = "0" + s;
  return (h + ":" + m + ":" + s);
}

function getCurrentDate(){
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return(Y + "-" + M + "-" + D);
}

function isPoneAvailable(str) {
  var myreg = /^1[0-9]{10}$/
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

function compareTime(str1, str2){
  var arr1 = str1.split(':')
  var arr2 = str2.split(':')
  if (parseInt(arr1[0]) > parseInt(arr2[0])) return false
  else if (parseInt(arr1[0]) == parseInt(arr2[0])){
    if (parseInt(arr1[1]) > parseInt(arr2[1])) return false
  }
  return true
}

function formatBookStr(item) {
  return item.bookType + " " + item.press + " " + item.condition;
}

module.exports = {
  isNumber: isNumber,
  getCurrentTime: getCurrentTime,
  getCurrentDate: getCurrentDate,
  isPoneAvailable: isPoneAvailable,
  compareTime: compareTime,
  formatBookStr: formatBookStr
};
