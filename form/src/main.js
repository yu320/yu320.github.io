const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: 'https://script.google.com/macros/s/AKfycbz82AUc5r2GyTOQ1P3bGG7-IoSCCwc1apIFcKUuS3NOvrsFUcIObmBX7I1ijOVdknCD/exec',

    id: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/1/d/e/1FAIpQLSdHpHF_mAywp1VJLuEUkvu2HAsjH3f4pmC9fe-35TBUG7Eg7g/formResponse',
    
    // Google Form 各個 input 的 name
    input: {
      id: 'entry.97452531',
      name: 'entry.219362454',
      gender: 'entry.1126848008',
      site: 'entry.1193857176',
      schoolsite: 'entry.596222107',
      schoolin: 'entry.1175993827',
      schoolmajoring: 'entry.294192904',
      howin: 'entry.1554095337',
      message: 'entry.1208194728'
    },

    // loading 效果要不要顯示
    loading: false
  },
  methods: {
    // ID 限填 4 碼
    limitIdLen(val) {
      if(val.length > 4) {
        return this.id =  this.id.slice(0, 4);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.name !== undefined) {
        let params =  `${this.input.id}=${this.person.id}&${this.input.name}=${this.person.name}&${this.input.gender}=${this.person.gender}&${this.input.site}=${this.person.site}&${this.input.schoolsite}=${this.person.schoolin}&${this.input.schoolmajoring}=${this.person.schoolmajoring}&${this.input.howin}=${this.person.howin}&${this.input.msg}=${this.person.msg} || '無'} `;
        fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功，若有問題將會跟你聯繫。');
            this.id = '';
            this.person = {};
          })
      }
    }
  },
  watch: {
    id: function(val) {
      // ID 輸入到 4 碼就查詢資料
      if(val.length === 4) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.id] === undefined) {
          this.loading = true;
          let uri = this.gas + '?id=' + this.id;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => {
              this.persons[this.id] = res; // 把這次查詢的 id 結果存下來
              this.person = res;
              this.loading = false;
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.id];
        }

      }
    }
  }
})