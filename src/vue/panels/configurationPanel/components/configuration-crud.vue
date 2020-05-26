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
  <md-content class="_container md-scrollbar">

    <div class="fabs">
      <md-speed-dial md-direction="top"
                     md-event="click"
                     md-effect="scale">
        <md-speed-dial-target class="md-fab md-bottom-right md-mini md-primary">
          <md-icon class="md-morph-initial">menu</md-icon>
          <md-icon class="md-morph-final">menu_open</md-icon>
        </md-speed-dial-target>

        <md-speed-dial-content class="configMdSpeedDialBtn">

          <create-item :title="'Create Configuration Profil'"
                       :fieldText="'Configuration Profil Name'"
                       @create="createConfiguration"
                       :disabled="!item.groupSelected"
                       v-if="item.groupSelected"
                       :icon="'add'"></create-item>

          <create-item :title="'Create Group'"
                       :fieldText="'Group Name'"
                       @create="createGroup"
                       :disabled="!item.categorySelected"
                       v-if="item.categorySelected"
                       :icon="'add'"></create-item>

          <create-item :title="'Create Category'"
                       :fieldText="'Category Name'"
                       @create="createCategory"
                       :icon="'add'"></create-item>

          <!-- <md-button class="md-primary md-dense"
                     @click.stop="importFile">
            <md-tooltip>Import</md-tooltip>
            Import
          </md-button>

          <md-button class="md-primary md-dense"
                     @click.stop="exportFile">
            <md-tooltip>Export</md-tooltip>
            Export
          </md-button> -->

        </md-speed-dial-content>
      </md-speed-dial>
    </div>

    <div class="exportHead">

      <v-btn outline
             color="#448aff"
             @click.stop="importFile">Import</v-btn>

      <v-btn outline
             color="#448aff"
             @click.stop="exportFile">Export</v-btn>

    </div>

    <div class="header">

      <div class="select select-categories">
        <select-item :placeholder="'Select category'"
                     :data="item.categories"
                     @select="selectCategory"
                     :value="item.categorySelected"></select-item>
      </div>

      <div class="select select-groups">
        <select-item :placeholder="'Select group'"
                     :data="item.groups"
                     @select="selectGroup"
                     :value="item.groupSelected"></select-item>
      </div>

      <div class="select select-configurations">
        <select-item :placeholder="'select configuration'"
                     :data="item.configurations"
                     @select="selectConfiguration"
                     :value="item.configurationSelected"></select-item>
      </div>

    </div>

    <div class="body">

      <div class="no-conf"
           v-if="!item.configurationSelected">
        Select a configuration
      </div>

      <configuration-component v-else
                               :configurationSelected="item.configurationSelected"
                               :currentConfiguration="currentConfiguration"
                               @getCurrentConf="currentConf">
      </configuration-component>

    </div>
  </md-content>
</template>


<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import { spinalConfigurationService } from "../../../../services";

import spinalExcelManager from "spinal-env-viewer-plugin-excel-manager-service";

import FileSaver from "file-saver";

import SelectItem from "./mdSelect.vue";
import CreateItem from "./createItem.vue";
import ConfigurationsComponent from "./configurations.vue";

export default {
  name: "configuration-template",
  props: {
    currentConfiguration: {},
    item: {},
    tempData: {}
  },
  components: {
    "create-item": CreateItem,
    "select-item": SelectItem,
    "configuration-component": ConfigurationsComponent
  },
  data() {
    return {};
  },
  async mounted() {
    const categories = await spinalConfigurationService.getCategories();
    this.item.categories = categories.map(el => el.get());
  },

  methods: {
    async createCategory(name) {
      const category = await spinalConfigurationService.createCategory(
        name,
        "add"
      );

      if (category && category.info) {
        this.item.categories.push(category.info.get());
      }
    },

    async createGroup(name) {
      const group = await spinalConfigurationService.createGroup(
        this.item.categorySelected,
        name,
        "#000000"
      );

      if (group && group.info) {
        this.item.groups.push(group.info.get());
      }
    },

    async createConfiguration(name) {
      const configuration = await spinalConfigurationService.createConfiguration(
        this.item.groupSelected,
        name
      );

      if (configuration && configuration.info) {
        this.item.configurations.push(configuration.info.get());
      }
    },

    async selectCategory(id) {
      if (typeof id !== "undefined") {
        this.item.categorySelected = id;
        const groups = await spinalConfigurationService.getGroups(id);
        this.item.groups = groups.map(el => el.get());

        // init group && configuration
        this.item.groupSelected = undefined;
        this.item.configurationSelected = undefined;
        // end
      }
    },

    async selectGroup(id) {
      if (typeof id !== "undefined") {
        this.item.groupSelected = id;
        const configurations = await spinalConfigurationService.getConfigurations(
          id
        );
        this.item.configurations = configurations.map(el => el.get());

        // init configuration
        this.item.configurationSelected = undefined;
        //end
      }
    },

    async selectConfiguration(id) {
      this.item.configurationSelected = id;
    },

    currentConf() {
      this.$emit("currentConf");
    },

    async exportFile() {
      //
      // spinalPanelManagerService.openPanel("exportConfigurationDialog", {});

      const result = {
        data: []
      };

      if (this.item.configurationSelected) {
        const item = await this._formatConfiguration(
          this.item.configurationSelected,
          this.item.groupSelected,
          this.item.categorySelected
        );

        result.data.push(item);
      } else if (this.item.groupSelected) {
        const items = await this._getGroupsItems(this.item.groupSelected);
        result.data.push(...items);
      } else if (this.item.categorySelected) {
        let groupsItems = this.item.groups.map(group => {
          return this._getGroupsItems(group.id);
        });

        let items = await Promise.all(groupsItems);

        items.forEach(el => {
          result.data.push(...el);
        });
      }

      spinalExcelManager.export(result).then(buffer => {
        FileSaver.saveAs(new Blob(buffer), `configurations_spinalcom.xlsx`);
      });
    },

    importFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept =
        ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
      input.click();

      input.addEventListener(
        "change",
        async event => {
          const file = event.target.files[0];
          const dataJson = await spinalExcelManager.convertConfigurationFile(
            file
          );

          spinalPanelManagerService.openPanel(
            "importConfigurationDialog",
            dataJson
          );
        },
        false
      );
    },

    async _formatConfiguration(configurationId, groupId, categoryId) {
      const data = {
        name: "",
        header: this._getExcelHeaders(),
        rows: []
      };

      const categoryFound = this.item.categories.find(
        el => el.id === categoryId
      );

      const groupFound = this.item.groups.find(el => el.id === groupId);

      const configFound = this.item.configurations.find(
        el => el.id === configurationId
      );

      const config = await spinalConfigurationService.getConfigurationById(
        configurationId
      );

      if (categoryFound && groupFound && configFound && config) {
        // data.name = `${categoryFound.name}|${groupFound.name}|${config.name}`;

        data.name = configFound.name;

        data.rows.push(["Category : ", categoryFound.name]);
        data.rows.push(["Group : ", groupFound.name]);
        data.rows.push(["Configuration Profil : ", configFound.name]);

        data.rows.push([, ,]);
        data.rows.push([, ,]);
        data.rows.push(["Attribute Category", "Attribute Name"]);

        config.categories.forEach(category => {
          const res = category.attributes.map(attribute => {
            // return {
            //   name: attribute.name,
            //   attrCategory: category.name,
            //   ConfigProfil: configFound.name,
            //   spinalCategory: categoryFound.name,
            //   spinalGroup: groupFound.name
            // };

            return [category.name, attribute.name];
          });

          data.rows.push(...res);
        });
        return data;
      }
    },

    _getExcelHeaders(attributes) {
      const header = [
        // {
        //   key: "attrCategory",
        //   header: "Attribute Category",
        //   width: 30
        // },
        // {
        //   key: "name",
        //   header: "Attribute Name",
        //   width: 30
        // }
        // // {
        // //   key: "ConfigProfil",
        // //   header: "Configuration Profil",
        // //   width: 30
        // // },
        // // {
        // //   key: "spinalCategory",
        // //   header: "Category",
        // //   width: 30
        // // },
        // // {
        // //   key: "spinalGroup",
        // //   header: "Group",
        // //   width: 30
        // // }
      ];

      return header;
    },

    async _getGroupsItems(groupId) {
      let configurations = [];

      if (this.item.groupSelected === groupId) {
        configurations = this.item.configurations;
      } else {
        configurations = await spinalConfigurationService.getConfigurations(
          groupId
        );
      }

      const promises = configurations.map(configuration => {
        return this._formatConfiguration(
          configuration.id,
          groupId,
          this.item.categorySelected
        );
      });

      return Promise.all(promises);
    },

    Open(...res) {
      console.log("res", res);
    }
  },
  watch: {
    async tempData() {
      if (this.tempData.hasOwnProperty("categoryId")) {
        await this.selectCategory(this.tempData.categoryId);
      }

      if (this.tempData.hasOwnProperty("groupId")) {
        await this.selectGroup(this.tempData.groupId);
      }

      if (this.tempData.hasOwnProperty("configId")) {
        await this.selectConfiguration(this.tempData.configId);
      }
    }
  }
};
</script>

<style scoped>
._container {
  width: 100%;
  height: 100%;
  background-color: transparent;
  overflow: hidden;
  overflow-x: auto;
}

._container .header {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

._container .header .select {
  width: 25%;
}

._container .exportHead {
  height: 40px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

._container .body {
  width: 100%;
  height: calc(100% - 100px);
}

._container .body .no-conf {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em;
}

._container .fabs {
  position: absolute;
  bottom: 24px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  /* width: 300px;
  height: 300px; */
}

._container .fabs > * {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

/* ._container .fabs > * {
  justify-content: center;
  align-items: flex-end;
} */

/* ._container .fabs .configMdSpeedDialBtn {
  z-index: 999;
} */
</style>


<style>
._container .fabs .configMdSpeedDialBtn .md-button .md-ripple {
  width: 250px;
}

._container .fabs .md-speed-dial-content {
  z-index: unset !important;
}

/* 
when fabs not active 
*/
._container
  .fabs
  .md-speed-dial.md-theme-default.md-direction-top.md-effect-scale
  .md-speed-dial-content.configMdSpeedDialBtn {
  display: none;
}

/* 
when fabs active 
*/
._container
  .fabs
  .md-speed-dial.md-theme-default.md-active.md-direction-top.md-effect-scale
  .md-speed-dial-content.configMdSpeedDialBtn {
  display: flex;
}

/* ._container
  .fabs
  .md-speed-dial.md-direction-top.md-effect-fling
  .md-speed-dial-content
  .md-button {
  background-color: #448aff;
  color: white;
} */
</style>
