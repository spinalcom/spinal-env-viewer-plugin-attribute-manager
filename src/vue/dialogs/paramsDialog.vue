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
  <md-dialog class="mdDialogContainer paramsDialogContainer" :md-active.sync="showDialog"
    @md-closed="closeDialog(false)">
    <md-dialog-title style="text-align : center">
      Set your configurations
    </md-dialog-title>
    <md-dialog-content style="overflow : hidden">

      <md-tabs class="myTabs" md-alignment="centered" @md-changed="changeTab">
        <md-tab id="current-param-tab" md-label="Current configuration" md-icon="offline_pin"></md-tab>

        <md-tab id="create-param-tab" md-label="Create configuration" md-icon="add"></md-tab>

        <md-tab id="all-params-tab" md-label="All configuration" md-icon="settings_applications"></md-tab>

      </md-tabs>

      <div class="tabsContent">

        <current-param v-if="tabDisplayed === 0" :currentConfiguration="currentConf" @refresh="RefreshData">
        </current-param>

        <edit-param v-if="tabDisplayed === 1" :data="allConfigurations" :currentConfiguration="currentConf"
          @change="changeCurrentConf" @refresh="RefreshData"></edit-param>

        <create-param v-if="tabDisplayed === 2" @refresh="RefreshData"></create-param>

      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog(false)">Close</md-button>
      <!-- <md-button class="md-primary"
                 @click="closeDialog(true)">Save</md-button> -->
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
// import menuComponent from "../../vue/panels/components/tooltips/addItem.vue";
import utilities from "../../js/utils/utilities";

import editParamsComponent from "./components/editParamsComponent.vue";
import currentConfiguration from "./components/paramsUploaded.vue";
import addConfiguration from "./components/createParamsComponent.vue";

export default {
  name: "paramDialogComponent",
  components: {
    "edit-param": editParamsComponent,
    "current-param": currentConfiguration,
    "create-param": addConfiguration
  },
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      typeSelected: "",
      data: [],
      callback: null,
      tabDisplayed: 0,
      allConfigurations: [],
      currentConf: undefined
    };
  },
  methods: {
    async opened(option) {
      this.typeSelected = option.typeSelected;
      this.callback = option.callback;
      await this.RefreshData();
    },

    async RefreshData() {
      this.allConfigurations = await utilities.getAllConfiguration();
      await this.changeCurrentConf();
    },

    async changeCurrentConf() {
      this.currentConf = await utilities.getCurrentConfiguration();
    },

    removed(option) {
      this.callback();
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },


    // formatData(headers, type) {
    //   return utilities.getElements(type).then(el => {
    //     if (el && el.get().length > 0) {
    //       return el.get();
    //     }

    //     let res = [];
    //     headers.forEach(el => {
    //       let found = res.find(el2 => el2.category === el.category);

    //       if (found) {
    //         found.attributes.push({
    //           show: false,
    //           label: el.label,
    //           date: el.date
    //         });
    //       } else {
    //         res.push({
    //           category: el.category,
    //           attributes: [
    //             {
    //               show: false,
    //               label: el.label,
    //               date: el.date
    //             }
    //           ]
    //         });
    //       }
    //     });

    //     return res;
    //   });
    // },

    changeTab(activeTab) {
      switch (activeTab) {
        case "current-param-tab":
          this.tabDisplayed = 0;
          break;

        case "all-params-tab":
          this.tabDisplayed = 1;
          break;

        case "create-param-tab":
          this.tabDisplayed = 2;
          break;
      }
    }
  }
};
</script>

<style scoped>
.mdDialogContainer.paramsDialogContainer {
  width: 700px !important;
  height: 700px;
}

.mdDialogContainer.paramsDialogContainer .myTabs {
  height: 70px;
}

.mdDialogContainer.paramsDialogContainer .tabsContent {
  width: calc(100% - 70px);
  height: calc(100% - 70px);
  margin: auto;
  margin-top: 10px;
}

.mdDialogContainer.paramsDialogContainer .list .emptyList {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.mdDialogContainer.paramsDialogContainer .list .addCategoryBtn {
  position: absolute;
  bottom: 30px;
  right: 20px;
}
</style>