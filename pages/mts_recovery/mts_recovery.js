const app = getApp()
Page({
  data: {
    date:'2018-7-20',
    clothesSelect:[0,0,0,0,0,0,0],
    selectImg: '../../image/select1.png',
    selectCount:0,
    selectAll: 0,
    clothes_color: 0,
    clothesColor: ['../../image/lv2.png','../../image/lan1.png'],
    clothes: ['../../image/w1.png', '../../image/d1.png', '../../image/j1.png', '../../image/y1.png', '../../image/m1.png', '../../image/k1.png', '../../image/q1.png',],
    index1: 0,
    array1: ['西苑一舍', '西苑二舍', '西苑三舍', '西苑四舍', '西苑五舍', '西苑六舍', '西苑七舍', '西苑八舍', '西苑九舍', '西苑十舍', '西苑十一舍', '西苑十二舍', '西苑十三舍', '西苑十四舍', '西苑十五舍', '西苑十六舍', '西苑十七舍', '西苑十八舍', '西苑十九舍', '西苑二十舍', '西苑二十一舍', '西苑二十二舍',],
    index2: 0,
    array2: ['一单元', '二单元', '三单元', '四单元', '五单元', '六单元', '七单元', '八单元', '九单元', '十单元', '十一单元', '十二单元'],
    index3: 0,
    array3: ['101A', '101B', '101C', '102A', '102B', '102C', '201A', '201B', '201C', '202A', '202B', '202C', '301A', '301B', '301C', '302A', '302B', '302C', '401A', '401B', '401C', '402A', '402B', '402C', '501A', '501B', '501C', '502A', '502B', '502C', '601A', '601B', '601C', '602A', '602B', '602C'],
    noteImg:'../../image/select1.png',
    noteRead:0
  },
  onLoad: function () {
    
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
  },
  bindPickerChange3: function (e) {
    this.setData({
      index3: e.detail.value
    })
  },
  selectClothes:function(e){
    if (e.target.dataset['index'] == null) return;
    var index = e.target.dataset['index']-'0';
    var clothes = this.data.clothesSelect;
    var clothesSrc = this.data.clothes;
    var count = this.data.selectCount;
    if (clothes[index]){
      clothes[index] = 0;
      clothesSrc[index] = clothesSrc[index].replace("2","1");
      count--;
    }else{
      clothes[index] = 1;
      clothesSrc[index] = clothesSrc[index].replace("1", "2");
      count++;
    }
    var b = false;
    for (var i = 0; i < 7; i++) {
      if (clothes[i] == 0) b = true;
    }
    this.setData({
      clothesSelect: clothes,
      clothes: clothesSrc,
      selectCount: count,
      selectImg: !b ? '../../image/select2.png' : '../../image/select1.png',
      selectAll: b ? 0 : 1
    })

  },
  selectAllClothes:function(e){
    var index = this.data.selectAll;
    var clothes = this.data.clothesSelect;
    var clothesSrc = this.data.clothes;
    index = index==1?0:1;
    for(var i = 0;i < 7;i++){
      if(index){
        clothes[i] = 1;
        clothesSrc[i] = clothesSrc[i].replace("1", "2");
      }else{
        clothes[i] = 0;
        clothesSrc[i] = clothesSrc[i].replace("2", "1");
      }
    }
    this.setData({
      selectCount: index == 1?7:0,
      selectAll: index,
      clothesSelect: clothes,
      clothes: clothesSrc,
      selectImg: index==1?'../../image/select2.png':'../../image/select1.png'
    })
  },
  selectColor: function(){
    var index = this.data.clothes_color;
    index = index==1?0:1;
    this.setData({
      clothes_color:index,
      clothesColor: index == 1 ? ['../../image/lv1.png', '../../image/lan2.png'] : ['../../image/lv2.png', '../../image/lan1.png']
    })
  },
  noteSelect: function(){
    var img = this.data.noteImg;
    var index = this.data.noteRead;
    index = index == 1 ? 0 : 1;
    if (img.search("1")!=-1){
      img = img.replace("1", "2");
    }
    else 
      img = img.replace("2", "1");
    this.setData({
      noteImg:img,
      noteRead: index
    })
  },
  showNote:function(){
    console.log(1);
    wx.showModal({
      title: '捐赠须知',
      content: '感谢你的支持',
      showCancel: false,
    })
  },
  formSubmit: function(e){
    var stu_id = e.detail.value['stu_id'];
    var phone = e.detail.value['stu_phone'];
    var date = this.data.date;
    var address = this.data.array1[this.data.index1] + this.data.array2[this.data.index2] + this.data.array3[this.data.index3];
    var color = this.data.clothes_color==0?'绿':'蓝';
    var gender = this.data.clothes_color == 0 ? '男' : '女';
    var selectClothes = this.data.clothesSelect;
    var b1 = false, b2 = false, b3 = false, b4 = true;
    var content;
    if(stu_id.length < 13){
      b1 = true;
      content = '输入学号有误';
    }
    else if(phone < 11){
      b2 = true;
      content = '输入电话有误';
    }
    else {
      for(var i = 0;i < 7;i++){
        if (this.data.clothesSelect[i] == 1){
          b4 = false;
        }
      }
      if(b4){
        content = '请至少选择一种物品捐赠';
      }
    }
    if(this.data.noteRead == 0) {
      b3 = true;
      if(!b1 && !b2 && !b4)
        content = '请先勾选捐赠须知';
    }
    if(b1||b2||b3||b4){
      wx.showModal({
        title: '',
        content: content,
        showCancel: false,
        success: function (res) {
          
        }
      })
    }
    else{
      console.log(this.data.clothesSelect[0]);
      wx.request({
        url: 'https://lightingx.top/donate',
        method: 'POST',
        data:{
          stu_id:stu_id,
          phone:phone,
          address:address,
          date:date,
          color:color,
          gender:gender,
          coat: this.data.clothesSelect[0],
          shirt: this.data.clothesSelect[1],
          shoe: this.data.clothesSelect[2],
          belt: this.data.clothesSelect[3],
          cap: this.data.clothesSelect[4],
          trouser: this.data.clothesSelect[5],
          glove: this.data.clothesSelect[6],
        },
        success: function(res){
          wx.showModal({
            title: '',
            content: '捐赠成功，感谢你的支持',
            showCancel: false,
          })
        },
        fail: function(){
          wx.showModal({
            title: '',
            content: '捐赠失败，请再试一次或联系工作人员',
            showCancel: false,
          })
        }
      })
    }
  }
})
