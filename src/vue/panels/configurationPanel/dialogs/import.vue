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
    <md-dialog-title class="dialogTitle">import Configuration</md-dialog-title>

    <md-dialog-content class="mdDialogContainer">
      <div v-if="appState === STATES.valid" class="valid">
        <md-icon class="md-size-4x">check</md-icon>
        <div>File imported.</div>
      </div>

      <div v-if="appState === STATES.normal" class="valid">
        <div>This file can be imported.</div>
      </div>

      <div v-else-if="appState === STATES.loading" class="loading">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>

      <div class="error" v-else-if="appState === STATES.error">
        <md-icon class="md-size-4x">close</md-icon>
        <div>Something went wrong !</div>
        <div>Check if the file is the same as the exported one</div>
      </div>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary" @click="closeDialog(true)" :disabled="appState !== STATES.normal">Import</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { spinalConfigurationService } from '../../../../services';

export default {
  name: 'importConfigurationDialog',
  props: ['onFinised'],
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
      data: [],
    };
  },
  methods: {
    opened(option) {
      this.appState = this.STATES.loading;
      const data = this.concatSheets(option);
      this.data = this.formatData(data);
      this.appState = this.STATES.normal;
    },

    async removed(option) {
      this.appState = this.STATES.loading;
      if (option) {
        try {
          await this.createElements(this.data);
          this.appState = this.STATES.valid;
        } catch (error) {
          this.appState = this.STATES.error;
        }
      } else {
        this.showDialog = false;
      }
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === 'function') {
        this.onFinised(closeResult);
      }
    },

    concatSheets(excelData) {
      const data = [];
      for (const values of Object.values(excelData)) {
        data.push(...values);
      }
      return data;
    },

    formatData(argExcelData) {
      const data = [];

      for (const element of argExcelData) {

        const { categoryFound, groupFound, configurationFound } = this.getTreeInData(data, element);

        let attributeCategoryFound = configurationFound.categories.find((el) => (el.name.toLowerCase() === element['Attribute Category'].toLowerCase()));

        if (typeof attributeCategoryFound === 'undefined') {
          attributeCategoryFound = { name: element['Attribute Category'], attributes: [], };
          configurationFound.categories.push(attributeCategoryFound);
        }

        let attributeFound = attributeCategoryFound.attributes.find((el) => (el.name.toLowerCase() === element['Attribute Name'].toLowerCase()));

        if (typeof attributeFound === 'undefined') {
          attributeCategoryFound.attributes.push({ show: true, name: element['Attribute Name'], id: Date.now() });
        }
      }

      return data;
    },

    async createElements(data) {
      for (const iterator of data) {
        const categoryId = await this._createCategory(iterator.name);

        for (const groupIterator of iterator.groups) {
          const groupId = await this._createGroup(
            categoryId,
            groupIterator.name
          );

          for (const configuration of groupIterator.configurations) {
            const configId = await this._createConfiguration(
              groupId,
              configuration.name
            );

            spinalConfigurationService.editConfiguration(
              configId,
              configuration
            );
          }
        }
      }
    },

    async _createCategory(name) {
      const category = await spinalConfigurationService.createCategory(
        name,
        'add'
      );

      return category.info.id.get();
    },

    async _createGroup(categoryId, name) {
      const group = await spinalConfigurationService.createGroup(
        categoryId,
        name,
        '#000000'
      );

      return group.info.id.get();
    },

    async _createConfiguration(groupId, name) {
      const configuration =
        await spinalConfigurationService.createConfiguration(groupId, name);

      return configuration.info.id.get();
    },

    getTreeInData(data, element) {
      let categoryFound = data.find((el) => el.name.toLowerCase() == element.Category.toLowerCase());

      if (!categoryFound) {
        categoryFound = { name: element.Category, groups: [] };
        data.push(categoryFound);
      }

      let groupFound = categoryFound.groups.find((el) => el.name.toLowerCase() == element.Group.toLowerCase());

      if (groupFound) {
        groupFound = { name: element.Group, configurations: [] };
        categoryFound.groups.push(groupFound);
      }

      let configurationFound = groupFound.configurations.find((el) => (el.name.toLowerCase() == element['Configuration Profil'].toLowerCase()));

      if (!configurationFound) {
        configurationFound = { name: element['Configuration Profil'], categories: [] };
        groupFound.configurations.push(configurationFound);
      }

      return { categoryFound, groupFound, configurationFound }
    }
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
