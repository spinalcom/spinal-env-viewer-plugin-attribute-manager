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
  <div class="paramsContainer"
       style="overflow : hidden">
    <md-tabs class="myTabs"
             md-alignment="centered"
             @md-changed="changeTab">

      <md-tab id="current-param-tab"
              md-label="Current configuration"
              md-icon="offline_pin"></md-tab>

      <md-tab id="all-params-tab"
              md-label="Configurations"
              md-icon="settings_applications"></md-tab>

      <!-- <md-tab id="all-params-tab"
                md-label="All configuration"
                md-icon="settings_applications"></md-tab> -->

    </md-tabs>

    <md-content class="tabsContent">

      <configuration-template class="content"
                              v-if="tabDisplayed === 1"
                              :currentConfiguration="currentConfiguration"
                              @currentConf="getCurrentConfiguration">
      </configuration-template>

      <current-configuration-template class="content"
                                      v-if="tabDisplayed === 0"
                                      :currentConfiguration="currentConfiguration">
      </current-configuration-template>

      <!-- <current-param v-if="tabDisplayed === 0"
                       :currentConfiguration="currentConf"
                       @refresh="RefreshData">
        </current-param>

        <edit-param v-if="tabDisplayed === 1"
                    :data="allConfigurations"
                    :currentConfiguration="currentConf"
                    @change="changeCurrentConf"
                    @refresh="RefreshData"></edit-param>

        <create-param v-if="tabDisplayed === 2"
                      @refresh="RefreshData"></create-param> -->

    </md-content>

  </div>
</template>

<script>
import ConfigurationCrud from "./components/configuration-crud.vue";

import CurrentConfigurationComponent from "./components/currentConfiguration.vue";

import { spinalConfigurationService } from "../../../services";

export default {
  name: "configurationPanel",
  components: {
    "configuration-template": ConfigurationCrud,
    "current-configuration-template": CurrentConfigurationComponent
  },
  data() {
    return {
      tabDisplayed: 1,
      currentConfiguration: undefined
    };
  },
  mounted() {},
  methods: {
    opened(params) {
      this.getCurrentConfiguration();
    },

    changeTab(activeTab) {
      switch (activeTab) {
        case "current-param-tab":
          this.tabDisplayed = 0;
          break;

        case "all-params-tab":
          this.tabDisplayed = 1;
          break;

        // case "create-param-tab":
        //   this.tabDisplayed = 2;
        //   break;
      }
    },

    async getCurrentConfiguration() {
      const currentConf = await spinalConfigurationService.getCurrentConfiguration();
      // console.log("currentConf", currentConf);
      this.currentConfiguration = currentConf.id;
    }
  }
};
</script>

<style scoped>
.paramsContainer {
  width: 100%;
  height: calc(100% - 15px);
  overflow: hidden;
}

.paramsContainer .myTabs {
  width: 100%;
  height: 70px;
}

.paramsContainer .tabsContent {
  width: calc(100% - 20px);
  height: calc(100% - 90px);
  margin: auto;
  margin-top: 10px;
  overflow: hidden;
}
</style>

<style>
.paramsContainer .myTabs .md-tabs-navigation .md-button {
  margin: 0;
  cursor: pointer;
  border-radius: 0;
  font-size: 13px;
  flex: 1 0 50%;
}
</style>