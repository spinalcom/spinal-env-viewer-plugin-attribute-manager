import Vue from 'vue';

export default new Vue.component('page-number', {
  el: "#v-datatable__page_number",
  props: {
    pageNumber: {}
  },
  render: function(createElement) {
    return createElement('div', this.pageNumber);
  }
})