<template>
  <div class="_mdContainer"
       v-if="attributesDisplayed && itemDisplayed">
    <div class="header">
      <div class="backBtn">
        <md-button @click="back">
          <md-icon>arrow_back</md-icon>
          &nbsp;
          BACK
        </md-button>
      </div>
      <div class="exportImport">
        <md-button class="md-primary">
          <md-icon>publish</md-icon>
          &nbsp;
          Import
        </md-button>
        <md-button class="md-primary">
          <md-icon>get_app</md-icon>
          &nbsp;
          Export
        </md-button>

      </div>
    </div>

    <div class="mdTableToolbar">
      <create-attribute :show="showAttrTooltip"
                        @open='openCreateAttrTooltips'></create-attribute>

      <md-button class="md-icon-button"
                 title="filter list">
        <md-icon>filter_list</md-icon>
      </md-button>
    </div>

    <div class="tableContent md-scrollbar">
      <md-table>

        <md-table-row>
          <md-table-head>Name</md-table-head>
          <md-table-head>Type</md-table-head>
          <md-table-head v-for="(head,index) in attributesDisplayed"
                         :key="index">{{head}}</md-table-head>

        </md-table-row>

        <md-table-row v-for="(item,index) in itemDisplayed"
                      :key="index">
          <md-table-cell>{{item.name}}</md-table-cell>
          <md-table-cell>{{item.type}}</md-table-cell>
          <md-table-cell v-for="(attr,index) in attributesDisplayed"
                         :key="index">{{getAttributeName(item,attr)}}
          </md-table-cell>
        </md-table-row>

      </md-table>
    </div>

  </div>
</template>

<script>
// import lodash from "lodash";

import CreateAttributeTooltips from "./tooltips/createAttribute.vue";

export default {
  name: "tableComponent",
  components: {
    "create-attribute": CreateAttributeTooltips
  },
  props: {
    itemDisplayed: {
      type: Array
    },
    attributesDisplayed: {
      type: Array
    }
  },
  data() {
    return {
      showAttrTooltip: false
    };
  },
  mounted() {
    // this.getTableContent();
  },
  methods: {
    back() {
      this.$emit("back");
    },
    getAttributeName(item, attr) {
      let found = item.attributes.find(el => el.label === attr);

      return typeof found !== "undefined" ? found.value : "-";
    },

    openCreateAttrTooltips() {
      this.showAttrTooltip = !this.showAttrTooltip;
    }
  },
  watch: {
    // itemDisplayed: function() {
    //   console.log("hello");
    //   lodash.debounce(this.getTableContent(), 150);
    // },
    // attributesDisplayed: function() {
    //   console.log("hello");
    //   lodash.debounce(this.getTableContent(), 150);
    // }
  }
};
</script>

<style scoped>
._mdContainer {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  overflow: hidden !important;
}

._mdContainer .header {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

._mdContainer .tableContent {
  width: 100%;
  height: calc(100% - 120px);
}

._mdContainer .tableContent .md-table {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* ._container .tableContent .md-toolbar {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  border: 1px solid red;
} */

.mdTableToolbar {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>