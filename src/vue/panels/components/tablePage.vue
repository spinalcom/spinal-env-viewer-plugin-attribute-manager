<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="tablePage"
       v-if="itemDisplayed">
    <div class="_mdContainer"
         v-if="appState === STATES.normal">
      <div class="header">
        <div class="backBtn">
          <md-button @click="back">
            <md-icon>arrow_back</md-icon>
            &nbsp;
            BACK
          </md-button>
        </div>
        <div class="exportImport">
          <md-button class="md-primary attr_btn"
                     @click="importExcel">
            <md-icon>get_app</md-icon>
            &nbsp;
            Import
          </md-button>
          <md-button class="md-primary attr_btn"
                     @click="exportData">
            <md-icon>publish</md-icon>
            &nbsp;
            Export
          </md-button>

        </div>
      </div>

      <div class="tableContent">
        <table-component :tableContent="tableContent"
                         :header="header"
                         :typeSelected="typeSelected"
                         @refresh="createAttribute"></table-component>
      </div>
    </div>

    <div class="loading"
         v-if="appState === STATES.loading">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>

    </div>
  </div>

</template>

<script>
// import lodash from "lodash";

// import CreateAttributeTooltips from "./tooltips/createAttribute.vue";

import TableComponent from "./table/index.vue";
import spinalExcelManager from "spinal-env-viewer-plugin-excel-manager-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import FileSaver from "file-saver";

import utilities from "../../../js/utilities";

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
    },
    typeSelected: {}
  },
  data() {
    this.STATES = Object.freeze({
      normal: 0,
      loading: 1,
      error: 2
    });

    return {
      // showAttrTooltip: false,
      appState: this.STATES.normal,
      tableContent: [],
      header: []
    };
  },
  async mounted() {
    this.tableContent = await this.getTableContent();
    this.header = await this.getAttributes();
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

    async getTableContent() {
      let content = [];
      let attributes = await this.getAttributes();

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

      // return { header: attributes, data: content };
      return content;
    },

    getAttributes() {
      // if (this.itemDisplayed) {
      //   this.itemDisplayed.forEach(el => {
      //     attrs.push(...el.attributes);
      //   });
      // }

      // return attrs.filter((elem, index, self) => {
      //   return (
      //     self.findIndex(t => {
      //       return t.category === elem.category && t.label === elem.label;
      //     }) === index
      //   );
      // });

      return utilities.getElements().then(values => {
        // let values = res.get();
        let attrs = [];

        values.forEach(value => {
          let items = value.attributes
            .map(attr => {
              if (attr.show) {
                return {
                  category: value.name,
                  label: attr.name
                };
              }
              return;
            })
            .filter(el2 => typeof el2 !== "undefined");

          attrs.push(...items);
        });

        return attrs;
      });
    },

    getAttributeValue(item, attr) {
      let found;
      if (item && attr) {
        found = item.attributes.find(el => el.label === attr.label);
      }

      return typeof found !== "undefined" ? found.value : "-";
    },

    getExportHeadersData() {
      let headers = [
        {
          key: "id",
          header: "SpinalGraph ID",
          width: 65
        },
        {
          key: "revit_id",
          header: "Revit ID",
          width: 15
        },
        {
          key: "name",
          header: "Name",
          width: 50
        }
        // {
        //   key: "type",
        //   header: "Type",
        //   width: 30
        // }
      ];

      this.header.forEach(head => {
        headers.push({
          key: `${head.category}_${head.label}`,
          header: `${head.category} / ${head.label}`,
          width: 15
        });
      });

      return headers;
    },

    getValue(item, attribute) {
      let found = item.attributes.find(el => {
        return (
          el.label === attribute.label && el.category === attribute.category
        );
      });

      return typeof found !== "undefined" ? found.value : "-";
    },

    getExportRowsData() {
      return this.tableContent.map(content => {
        let info = {
          id: content.id,
          name: content.name,
          revit_id: this._getRevitID(content.name)
        };

        this.header.forEach(head => {
          let value = this.getValue(content, head);
          info[`${head.category}_${head.label}`] = value;
        });

        return info;
      });
    },

    formatExportData() {
      return [
        {
          data: [
            {
              name: "sheet 1",
              header: this.getExportHeadersData(),
              rows: this.getExportRowsData()
            }
          ]
        }
      ];
    },

    exportData() {
      let result = this.formatExportData();

      spinalExcelManager.export(result).then(buffer => {
        FileSaver.saveAs(new Blob(buffer), `spinalcom.xlsx`);
      });
    },

    _getRevitID(name) {
      let reg = /\[(.*)\]/gim;
      let macthed = name.match(reg);
      if (macthed && macthed.length > 0) {
        let value = JSON.parse(macthed[macthed.length - 1]);
        return value[0];
      }

      return "-";
    },

    importExcel() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept =
        ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
      input.click();

      input.addEventListener(
        "change",
        async event => {
          const file = event.target.files[0];

          this.appState = this.STATES.loading;

          const dataJson = await spinalExcelManager.convertExcelToJson(file);

          this.$emit("openExportDialog", {
            data: dataJson,
            table: this.tableContent
          });

          this.$destroy();
          // this.appState = this.STATES.normal;
        },
        false
      );
    }
  },
  watch: {
    itemDisplayed: async function() {
      this.tableContent = await this.getTableContent();
      this.header = await this.getAttributes();
    }
    // attributesDisplayed: function() {

    //   lodash.debounce(this.getTableContent, 500, { maxWait: 1000 });
    // }
  },
  beforeDestroy() {
    this.appState = this.STATES.normal;
  }
};
</script>

<style scoped>
.tablePage {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
}

.tablePage ._mdContainer {
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow: hidden !important;
}

.tablePage ._mdContainer .header {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.tablePage ._mdContainer .tableContent {
  width: 100%;
  height: calc(100% - 60px);
}

.categoryInHead {
  color: #448aff;
}

.tablePage .loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style>
.attr_btn {
  border: 1px solid #448aff;
  min-width: 100px;
  max-width: 150px;
  padding-right: 5px;
}
</style>