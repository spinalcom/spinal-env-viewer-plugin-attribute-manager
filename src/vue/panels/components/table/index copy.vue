<template>
  <div class="_tableContent">

    <div class="buttonFab">

      <md-button v-if="!editMode"
                 @click="LinkItem"
                 class="md-fab md-mini md-primary">
        <md-icon>link</md-icon>
      </md-button>

      <md-button v-if="!editMode"
                 @click="ActiveEditMode"
                 class="md-fab md-mini md-primary">
        <md-icon>edit</md-icon>
      </md-button>

      <md-button v-if="editMode"
                 @click="validateOrCancel(false)"
                 class="md-fab md-mini md-plain">
        <md-icon>clear</md-icon>
      </md-button>

      <md-button v-if="editMode"
                 @click="validateOrCancel(true)"
                 class="md-fab md-mini md-primary">
        <md-icon>done</md-icon>
      </md-button>
    </div>

    <!-- First Toolbar -->
    <md-toolbar class="mdToolbar"
                md-elevation="0">

      <md-field class="md-toolbar-start">
        <input class="md-input"
               placeholder="Search by name..."
               v-model="searchByName" />
        <!-- @input="searchOnTable" /> -->
      </md-field>

      <div class="md-toolbar-end">

        <!-- <md-field class="mdSelect">

          <md-select v-model="headerSelected"
                     placeholder="Filter by Column"
                     name="columns"
                     id="columns"
                     multiple>
            <md-option v-for="(head,index) in header"
                       :key="index"
                       :value="`${head.category} / ${head.label}`">
              {{`${head.category} / ${head.label}`}}
            </md-option>
          </md-select>
        </md-field> -->
        <div class="ParamaterDiv">
          <md-button class="md-primary attr_btn"
                     @click="OpenParamsDialog">
            <md-icon>settings_applications</md-icon>
            &nbsp;
            Params
          </md-button>
        </div>

      </div>
    </md-toolbar>
    <!-- End First Toolbar -->

    <!-- Second Toolbar -->
    <md-toolbar class="mdToolbar secondToolbar"
                md-elevation="0">

      <div class="md-toolbar-start">
        <md-field class="md-toolbar-start">
          <md-input placeholder="Search by Value..."
                    v-model="searchByValue" />
          <!-- @input="searchOnTableByValue" /> -->
        </md-field>
      </div>

      <div class="md-toolbar-end">

        <change-col-value v-if="editMode"
                          :columns="headerDisplayed"
                          :itemsSelected="itemsSelected"
                          @setValueToColumn="setValueToColumn">
        </change-col-value>

        <create-attribute :show="showAttrTooltip"
                          @open='openCreateAttrTooltips'
                          :itemFiltered="itemsSelected"
                          @validate="createAttribute"></create-attribute>
      </div>

    </md-toolbar>
    <!-- End Second Toolbar -->

    <md-table v-model="searched"
              class="md-scrollbar"
              @md-selected="onSelect">

      <md-table-empty-state md-label="No data found"
                            :md-description="`No data found `">

      </md-table-empty-state>

      <!-- <md-table-row slot="md-table-row"
                    slot-scope="{ item }"
                    class="tableRow"
                    md-selectable="multiple"
                    @click="selectItemInViewer(item)">
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Type">{{ item.type }}</md-table-cell> -->

      <!-- <md-table-cell v-for="(attribute,index) in headerDisplayed"
                       :key="index"
                       :md-label="`${attribute.category} / ${attribute.label}`">

          <table-content-component :editable="editMode"
                                   :item="item"
                                   :attribute="attribute"
                                   @setValue="setValue"
                                   ref="editableComponent">
          </table-content-component>
        </md-table-cell> -->
      <!-- </md-table-row> -->

    </md-table>
  </div>
</template>

<script>
import TableContentComponent from "./tableContent.vue";
import CreateAttributeTooltips from "../tooltips/createAttribute.vue";
import ChangeColValue from "../tooltips/changeCol.vue";
import attributeService from "../../../../services";

const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

const lodash = require("lodash");

export default {
  name: "TableComponent",
  props: {
    tableContent: {},
    header: {}
  },
  components: {
    "table-content-component": TableContentComponent,
    "create-attribute": CreateAttributeTooltips,
    "change-col-value": ChangeColValue
  },
  data() {
    return {
      showAttrTooltip: false,
      editMode: false,
      searched: [],
      searchByName: "",
      searchByValue: "",
      itemsSelected: [],
      headerSelected: [],
      headerDisplayed: []
    };
  },
  created() {
    this.searchAndFilterByName = lodash.debounce(this.searchOnTable, 500);
    this.searchAndFilterByValue = lodash.debounce(
      this.searchOnTableByValue,
      500
    );
  },
  mounted() {
    this.searched = this.tableContent;
  },
  methods: {
    validateOrCancel(valid) {
      let references = this.$refs["editableComponent"]
        ? this.$refs["editableComponent"]
        : [];

      if (valid) {
        references.forEach(compo => {
          compo.validateValue();
        });
      } else {
        references.forEach(compo => {
          compo.cancelValue();
        });
      }

      this.editMode = false;
    },
    ActiveEditMode() {
      this.editMode = true;
    },
    openCreateAttrTooltips() {
      this.showAttrTooltip = !this.showAttrTooltip;
    },
    createAttribute() {
      this.$emit("refresh");
    },

    filterByName(liste, name) {
      if (name.trim().length > 0) {
        return liste.filter(item => {
          return item.name.toLowerCase().includes(name.trim().toLowerCase());
        });
      }

      return liste;
    },
    filterByValue(liste, value) {
      if (value.trim().length > 0) {
        return liste.filter(el => {
          let found = el.attributes.find(attr => {
            return attr.value
              .toString()
              .toLowerCase()
              .includes(value.trim().toLowerCase());
          });

          return found ? true : false;
        });
      }

      return liste;
    },
    searchOnTable() {
      this.searched = this.filterByName(this.tableContent, this.searchByName);

      // this.searched = this.filterByName(this.tableContent, this.searchByName);
    },
    searchOnTableByValue() {
      this.searched = this.filterByValue(this.tableContent, this.searchByValue);
    },
    onSelect(items) {
      this.itemsSelected = items;
    },
    selectItemInViewer(item) {
      attributeService.getBimObjects(item.id);
    },
    setValue() {
      this.$emit("refresh");

      // let item = this.tableContent.find(el => el.id === argData.item.id);

      // let found;
      // if (item && argData.attribute) {
      //   found = item.attributes.find(el => {
      //     return (
      //       el.label === argData.attribute.label &&
      //       el.category === argData.attribute.category
      //     );
      //   });
      // }
      // if (typeof found !== "undefined") {
      //   found.value = argData.value;
      // }
    },
    setValueToColumn(res) {
      let references = this.$refs["editableComponent"];

      let value = res.value;
      let category = res.column.split("/")[0];
      let label = res.column.split("/")[1];

      references.forEach(el => {
        el.setValueToColumn(category, label, value);
      });
    },
    LinkItem() {
      if (this.itemsSelected.length === 0)
        return alert("you must select at less one item");

      spinalPanelManagerService.openPanel("linkToGroupDialog", {
        itemSelected: this.itemsSelected
      });
    },
    OpenParamsDialog() {
      spinalPanelManagerService.openPanel("paramDialogComponent", {
        tableContent: this.tableContent,
        header: this.header
      });
    }
  },
  watch: {
    tableContent() {
      // let data = this.tableContent.data.map(el => {
      //   let info = {};
      //   info["id"] = el.id;
      //   info["name"] = el.name;
      //   info["type"] = el.type;

      //   this.header.forEach(element => {
      //     info[`${element.category}/${element.label}`] = element.value;
      //   });

      //   return info;
      // });

      // this.searched = data;

      this.searched = this.filterByName(this.tableContent, this.searchByName);
    },
    header() {
      this.headerSelected = this.header.map(el => {
        return `${el.category} / ${el.label}`;
      });
    },
    headerSelected() {
      this.headerDisplayed = this.header.filter(el => {
        let item = `${el.category} / ${el.label}`;
        return this.headerSelected.indexOf(item) !== -1;
      });
    },
    searchByName() {
      // lodash.debounce(() => {
      //   this.searchOnTable();
      // }, 500);
      this.searchAndFilterByName();
    },
    searchByValue() {
      // lodash.debounce(() => {
      //   this.searchOnTableByValue();
      // }, 500);

      this.searchAndFilterByValue();
    }
  }
};
</script>

<style scoped>
.ParamaterDiv {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding-right: 20px;
}

._tableContent {
  width: 100%;
  height: 100%;
}

._tableContent .mdToolbar {
  width: 100%;
  height: 60px;
  padding: 0px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

._tableContent .md-content.md-theme-default {
  background: transparent !important;
}

._tableContent .mdToolbar .md-toolbar-start,
._tableContent .mdToolbar .md-toolbar-end {
  width: calc(45%) !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

/* ._tableContent .mdToolbar .md-toolbar-end .mdSelect {
  width: 50%;
} */

._tableContent .md-table {
  width: 100%;
  height: calc(100% - 128px);
  overflow: auto;
}

._tableContent .md-table .tableRow:hover {
  cursor: pointer;
}

.buttonFab {
  position: absolute;
  bottom: 30px;
  right: 20px;
}

/* ._tableContent .md-table.md-theme-default .md-table-row td {
  min-width: 60px;
  max-width: 80px;
  text-align: center;
} */

.secondToolbar .md-toolbar-end {
  display: flex;
  justify-content: flex-end !important;
}
</style>