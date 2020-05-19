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
  <md-dialog class="_mdDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">

    <md-dialog-title class="_dialogTitle">
      Select type
    </md-dialog-title>

    <md-dialog-content class="_dialogContent">

      <div class="loading"
           v-if="appState === STATES.normal">
        <md-field>
          <label for="type">Type</label>
          <md-select v-model="typeSelected"
                     name="type"
                     id="type">
            <md-option v-if="!data || data.types.length === 0"
                       disabled>No found</md-option>

            <md-option v-for="(type, index) in data.types"
                       :key="index"
                       :value="type">{{type}}</md-option>

          </md-select>
        </md-field>
      </div>

      <!--
          /////////////////////////////////
          Loading
          ////////////////////////////////
        -->
      <div v-if="appState === STATES.loading"
           class="loading">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>

      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="disabled()">Save</md-button>

    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import SpinalAttributeManager from "../../../../services";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

export default {
  name: "select-type",
  props: ["onFinised"],
  data() {
    this.STATES = Object.freeze({
      normal: 0,
      loading: 1,
      error: 2
    });

    return {
      appState: this.STATES.error,
      showDialog: true,
      data: {},
      typeSelected: ""
    };
  },
  methods: {
    async opened(params) {
      this.appState = this.STATES.loading;
      this.data = await this.getAllData(params);
      this.appState = this.STATES.normal;
    },

    removed(option) {
      if (option) {
        const items = this.getItems(this.typeSelected);

        spinalPanelManagerService.openPanel("generateGroupPanel", {
          type: this.typeSelected,
          items: items
        });
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    getAllData(params) {
      return SpinalAttributeManager.getAllData(params.id, params.id);
    },

    getItems(type) {
      return this.data.data[type];
    },

    disabled() {
      return this.typeSelected.trim().length === 0;
    }
  }
};
</script>

<style scoped>
._mdDialogContainer {
  width: 300px;
  height: 300px;
}

._mdDialogContainer ._dialogTitle {
  text-align: center;
}

._mdDialogContainer .loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>