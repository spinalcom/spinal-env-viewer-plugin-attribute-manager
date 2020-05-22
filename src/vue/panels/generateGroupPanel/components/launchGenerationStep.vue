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
  <div class="content">

    <div class="buttons"
         v-if="appState === STATES.normal">
      <!-- <md-button v-if="!verified"
                 class="md-raised md-primary"
                 @click="launchVerification">Verify</md-button> -->
      <md-button :disabled="error"
                 class="md-raised md-primary"
                 @click="launchGeneration">Launch Generation</md-button>
    </div>

    <div class="state"
         v-else-if="appState === STATES.loading">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>

    </div>

    <div class="state"
         v-else-if="appState === STATES.success">
      <md-icon class="md-size-4x">check</md-icon>

    </div>

    <div class="state"
         v-else-if="appState === STATES.error">
      <md-icon class="md-size-4x">close</md-icon>
    </div>

  </div>
</template>

<script>
import CREATE_DATA from "../js/data.js";

import utilities from "../js/utilities.js";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import groupManagerService from "spinal-env-viewer-plugin-group-manager-service";

import { Ptr, Model } from "spinal-core-connectorjs_type";

export default {
  name: "launchGeneration",
  props: {
    data: {},
    type: {},
    error: {}
  },
  data() {
    this.STATES = {
      loading: 1,
      normal: 2,
      success: 3,
      error: 4
    };
    return {
      verified: false,
      valueGrouped: null,
      appState: this.STATES.normal
    };
  },
  methods: {
    async launchVerification() {
      this.appState = this.STATES.loading;
      const contextCondition = this.data.context.name.trim().length > 0;

      const categoryCondition =
        this.data.category.regex.toString().length > 0 ||
        this.data.category.name.trim().length > 0;

      const groupCondition =
        this.data.group.regex.toString().length > 0 ||
        this.data.group.name.trim().length > 0;

      // if (contextCondition && categoryCondition && groupCondition) {
      this.valueGrouped = await this.classifyItem(
        this.data.category,
        this.data.group
      );

      this.verified = true;
      // } else {
      //   this.$emit("error");
      // }
      console.log("items", this.valueGrouped);
      this.appState = this.STATES.normal;
    },

    async launchGeneration() {
      this.appState = this.STATES.loading;
      let contextId = await this.getContext();

      this.createNodes(contextId)
        .then(res => {
          this.saveConfiguration(contextId, this.data);
          this._displayResult(this.STATES.success);
        })
        .catch(err => {
          this._displayResult(this.STATES.error);
          console.error(err);
        });
    },

    _displayResult(result) {
      this.appState = result;
      setTimeout(() => {
        this.appState = this.STATES.normal;
      }, 1000);
    },

    async classifyItem(categoryInfo, groupInfo) {
      const res = [];
      const unclassify = "unclassify";

      for (const item of this.data.items) {
        const spinalId = item.id;

        const categoryName = await utilities.getValue(
          spinalId,
          categoryInfo,
          this.type
        );
        const groupName = await utilities.getValue(
          spinalId,
          groupInfo,
          this.type
        );

        let categoryFound = res.find(el => {
          if (categoryName) return el.name === categoryName;
          return el.name === unclassify;
        });

        if (typeof categoryFound === "undefined") {
          categoryFound = {
            name: categoryName ? categoryName : unclassify,
            groups: []
          };
          res.push(categoryFound);
        }

        let groupFound = categoryFound.groups.find(el => {
          if (groupName) return el.name === groupName;
          return el.name === unclassify;
        });

        if (typeof groupFound === "undefined") {
          groupFound = {
            name: groupName ? groupName : unclassify,
            items: [],
            color: groupName ? this._generateColor() : "#ff0000"
          };
          categoryFound.groups.push(groupFound);
        }

        groupFound.items.push(item);
      }

      return res;
    },

    async getContext() {
      if (this.data.context.create) {
        const contextName = utilities._getValidContextName(
          this.data.context.name
        );

        const context = await groupManagerService.createGroupContext(
          contextName,
          this.type
        );

        return context.info.id.get();
      }

      return this.data.context.id;
    },

    async createNodes(contextId) {
      this.valueGrouped = await this.classifyItem(
        this.data.category,
        this.data.group
      );

      for (const obj of this.valueGrouped) {
        const category = await utilities.createCategory(contextId, obj.name);

        for (const el of obj.groups) {
          const group = await utilities.createGroup(
            contextId,
            category.info.id.get(),
            el.name,
            el.color
          );

          for (const item of el.items) {
            utilities.addElement(contextId, group.info.id.get(), item.id);
          }
        }
      }

      return;
    },

    saveConfiguration(contextId, configuration) {
      const context = SpinalGraphService.getRealNode(contextId);
      const dataCopy = Object.assign({}, this.data);

      dataCopy.context.create = true;
      dataCopy.category.regex = dataCopy.category.regex.toString();
      dataCopy.group.regex = dataCopy.group.regex.toString();

      if (context) {
        if (context.info.generate_group_config) {
          context.info.rem_attr("generate_group_config");
        }

        const model = new Model({
          context: dataCopy.context,
          category: dataCopy.category,
          group: dataCopy.group
        });

        context.info.add_attr({
          generate_group_config: new Ptr(model)
        });
      }
    },

    _generateColor() {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
}

.content .buttons {
  width: 100%;
  display: flex;
  justify-content: center;
}

.state {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>