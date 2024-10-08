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
  <md-dialog :md-active.sync="showDialog" @md-closed="closeDialog(false)">
    <md-dialog-title class="dialogTitle">Import Data</md-dialog-title>

    <md-dialog-content class="mdDialogContainer">
      <!-- Valid State -->
      <div v-if="appState === STATES.valid" class="valid">
        <md-icon class="md-size-4x">check</md-icon>
        <div>File imported.</div>
      </div>

      <!-- Normal State -->
      <div v-if="appState === STATES.normal" class="valid">
        <div>This file can be imported.</div>
      </div>

      <!-- Loading State -->
      <div v-else-if="appState === STATES.loading" class="loading">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>

      <!-- Error State -->
      <div class="error" v-else-if="appState === STATES.error">
        <md-icon class="md-size-4x">close</md-icon>
        <div>Something went wrong !</div>
        <div>Check if the file is the same as the exported one</div>
      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary" @click="updateData" :disabled="appState !== STATES.normal">Import</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import attributeService from "../../services";
import { importExcelUtils } from "../../js/utils/importExcelUtils";

export default {
  name: "ImportAttributeExcelDialog",
  props: ["onFinised"],
  data() {
    this.STATES = Object.freeze({
      valid: 0,
      loading: 1,
      error: 2,
      normal: 3,
    });

    return {
      appState: this.STATES.normal,
      showDialog: true,
      dataToUpdate: [],
      itemsMap: new Map(),
      callback: () => { },
    };
  },

  methods: {
    async opened(option) {

      try {
        this.appState = this.STATES.loading;
        this.callback = option.callback;

        // this.constructMap(option.tableData);
        // const excelData = this.concatSheets(option.excelData);

        // const data = this.formatExcelData(excelData);
        // this.data = await this.getDifferenceBetweenData(data, option.tableData);


        this.itemsMap = importExcelUtils.convertTableToMap(option.tableData);
        const excelDataFormatted = importExcelUtils.convertExcelDataToObj(option.excelData);
        this.dataToUpdate = importExcelUtils.getDifferenceBetweenTableAndExcel(excelDataFormatted, option.tableData);

        if (this.dataToUpdate) this.appState = this.STATES.normal;
        else this.appState = this.STATES.error;

      } catch (error) {
        console.error(error);
        this.appState = this.STATES.error;
      }

    },

    async removed(option) {
      await this.callback();
      this.showDialog = false;
    },

    async updateData() {

      try {
        this.appState = this.STATES.loading;

        await this._changeValue()
        await this.callback();

        this.appState = this.STATES.valid;

      } catch (error) {
        console.error(error);
        this.appState = this.STATES.error;
      }
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    // formatExcelData(excelData) {
    //   return excelData.map((data) => {
    //     let obj = { id: "", attributes: [] };

    //     obj.id = data["SpinalGraph ID"];
    //     obj.name = data["Name"];

    //     const lists = ["name", "spinalgraph id", "revit id"];

    //     for (const key of Object.keys(data)) {
    //       // if (!key.includes(" / ")) continue;

    //       if (lists.indexOf(key.toLowerCase()) !== -1) continue;

    //       const list = key.split(" / ");

    //       obj.attributes.push({
    //         category: list[0] ? list[0] : "",
    //         label: list[1] ? list[1] : "",
    //         value: data[key] ? data[key] : "-",
    //       });
    //     }

    //     return obj;
    //   });
    // },

    // concatSheets(excelData) {
    //   const data = [];
    //   for (const values of Object.values(excelData)) {
    //     data.push(...values);
    //   }
    //   return data;
    // },

    // constructMap(tableContent) {
    //   for (const content of tableContent) {
    //     const element = {};
    //     for (const attr of content.attributes) {
    //       element[`${attr.category}_${attr.label}`] = {
    //         value: attr.value,
    //         displayValue: attr.value,
    //       };
    //     }
    //     this.itemsMap.set(content.id, element);
    //   }
    // },

    // getDifferenceBetweenData(excelData, tableContent) {
    //   const diff = [];
    //   for (const dataIterator of excelData) {
    //     let found = tableContent.find((el) => el.id === dataIterator.id);

    //     if (found && found.attributes) {
    //       const diffAttr = this._getAttrDiff(found, dataIterator);

    //       if (typeof diffAttr === "undefined") {
    //         continue;
    //       } else if (
    //         diffAttr &&
    //         (diffAttr.newName || diffAttr.attributes.length > 0)
    //       ) {
    //         diff.push(diffAttr);
    //       }
    //     }
    //   }

    //   return diff;
    // },

    async _changeValue() {
      const promises = [];

      for (const found of this.dataToUpdate) {
        if (found && found.newName) await this.editNodeName(found.id, found.newName);

        const obj = this._classifyByCategory(found.attributes);

        for (const category in obj) {
          const attributes = obj[category];
          promises.push(attributeService.updateSeveralAttributes(found.id, category, attributes));
        }
      }

      return Promise.all(promises);
    },

    _classifyByCategory(attributes = []) {
      return attributes.reduce((acc, attr) => {
        if (acc[attr.category]) {
          acc[attr.category].push(attr);
        } else {
          acc[attr.category] = [attr];
        }
        return acc;
      }, {});
    },

    // _getAttrDiff(tableItem, excelItem) {
    //   let obj = {
    //     id: tableItem.id,
    //     attributes: [],
    //   };

    //   if (tableItem.name !== excelItem.name) {
    //     obj.newName = excelItem.name;
    //   }

    //   for (const attr of excelItem.attributes) {
    //     let attrFound = tableItem.attributes.find((el) => {
    //       return attr.category === el.category && attr.label === el.label;
    //     });

    //     if (attrFound && attrFound.value != attr.value) {
    //       obj.attributes.push(attr);
    //     }
    //     // else if (typeof attrFound === "undefined") {
    //     //   return;
    //     // }
    //   }

    //   return obj;
    // },

    editNodeName(nodeId, newName) {
      const realNode = SpinalGraphService.getRealNode(nodeId);
      if (realNode) {
        realNode.info.name.set(newName);
      }
    },

    /*
    convertDataToJson(tableData) {
      return tableData.map(el => {
        let res = {};
  
        res["SpinalGraph ID"] = el.id;
        res["Name"] = el.name;
  
        el.attributes.forEach(attr => {
          res[`${attr.category} / ${attr.label}`] = attr.value;
        });
  
        return res;
      });
    },
  
    getDataModified(excelData, tableData) {
      let formated = excelData.map(data => {
        let found = tableData.find(el => {
          return el["SpinalGraph ID"] === data["SpinalGraph ID"];
        });
  
        if (typeof found !== "undefined") {
        }
  
        return;
      });
  
      return formated.filter(el => {
        return typeof el !== "undefined";
      });
    },
  
    */
  },
};
</script>

<style scoped>
.mdDialogContainer {
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialogTitle {
  text-align: center;
}

.mdDialogContainer .valid,
.mdDialogContainer .error {
  text-align: center;
  font-size: 20px;
}

.mdDialogContainer .valid .md-icon {
  color: green;
}

.mdDialogContainer .error .md-icon {
  color: red;
}
</style>