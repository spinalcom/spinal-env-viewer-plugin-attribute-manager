<template>
  <div class="_mdContainer"
       v-if="itemDisplayed">

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

    <!-- <div class="mdTableToolbar">
      <create-attribute :show="showAttrTooltip"
                        @open='openCreateAttrTooltips'
                        :itemFiltered="itemDisplayed"
                        @validate="createAttribute"></create-attribute>

      <md-button class="md-icon-button"
                 title="filter list">
        <md-icon>filter_list</md-icon>
      </md-button>
    </div> -->

    <div class="tableContent">
      <table-component :tableContent="tableContent"
                       @refresh="createAttribute"></table-component>
    </div>

  </div>
</template>

<script>
// import lodash from "lodash";

// import CreateAttributeTooltips from "./tooltips/createAttribute.vue";

import TableComponent from "./table/index.vue";

export default {
  name: "tablePage",
  components: {
    // "create-attribute": CreateAttributeTooltips,
    "table-component": TableComponent
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
      // showAttrTooltip: false,
      tableContent: []
    };
  },
  mounted() {
    this.tableContent = this.getTableContent();
    console.log("mounted", this.tableContent);
  },
  methods: {
    back() {
      this.$emit("back");
    },

    // openCreateAttrTooltips() {
    //   this.showAttrTooltip = !this.showAttrTooltip;
    // },
    createAttribute() {
      this.$emit("refresh");
    },

    getTableContent() {
      let content = [];
      let attributes = this.getAttributes();

      if (this.itemDisplayed) {
        content = this.itemDisplayed.map(item => {
          return {
            id: item.id,
            name: item.name,
            type: item.type,
            attributes: attributes.map(el => {
              return {
                category: el.category,
                label: el.label,
                date: el.date,
                value: this.getAttributeValue(item, el)
              };
            })
          };
        });
      }

      return { header: attributes, data: content };
    },

    getAttributes() {
      let attrs = [];
      if (this.itemDisplayed) {
        this.itemDisplayed.forEach(el => {
          attrs.push(...el.attributes);
        });
      }

      return attrs.filter((elem, index, self) => {
        return (
          self.findIndex(t => {
            return t.category === elem.category && t.label === elem.label;
          }) === index
        );
      });
    },

    getAttributeValue(item, attr) {
      let found;
      if (item && attr) {
        found = item.attributes.find(el => el.label === attr.label);
      }

      return typeof found !== "undefined" ? found.value : "-";
    }
  },
  watch: {
    // itemDisplayed: function() {
    //   console.log("itemDisplayed hello");
    //   lodash.debounce(this.getTableContent, 500, { maxWait: 1000 });
    // },
    // attributesDisplayed: function() {
    //   console.log("attributes hello");
    //   lodash.debounce(this.getTableContent, 500, { maxWait: 1000 });
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
  height: calc(100% - 60px);
}

/* ._container .tableContent .md-toolbar {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  border: 1px solid red;
} */

/* .mdTableToolbar {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
} */

.categoryInHead {
  color: #448aff;
}
</style>