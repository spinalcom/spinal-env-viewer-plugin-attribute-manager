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

    <!-- <div class="buttons">
      <create-item :title="'Create Category'"
                   :fieldText="'Category Name'"
                   @create="createCategory"></create-item>

      <create-item :title="'Create Group'"
                   :fieldText="'Group Name'"
                   @create="createGroup"></create-item>

      <create-item :title="'Create Configuration Profil'"
                   :fieldText="'Configuration Profil Name'"
                   @create="createConfiguration"></create-item>

    </div> -->

    <div class="fabs">
      <md-speed-dial md-direction="top"
                     md-event="click">
        <md-speed-dial-target class="md-fab md-bottom-right md-mini md-primary">
          <md-icon class="md-morph-initial">menu</md-icon>
          <md-icon class="md-morph-final">menu_open</md-icon>
        </md-speed-dial-target>

        <md-speed-dial-content class="mdSpeedDialBtn">

          <create-item :title="'Create Category'"
                       :fieldText="'Category Name'"
                       @create="createCategory"></create-item>

          <create-item :title="'Create Group'"
                       :fieldText="'Group Name'"
                       @create="createGroup"
                       :disabled="!item.categorySelected"></create-item>

          <create-item :title="'Create Configuration Profil'"
                       :fieldText="'Configuration Profil Name'"
                       @create="createConfiguration"
                       :disabled="!item.groupSelected"></create-item>

        </md-speed-dial-content>
      </md-speed-dial>
    </div>

    <div class="exportHead">

      <v-btn outline
             color="#448aff">Import</v-btn>

      <v-btn outline
             color="#448aff">Export</v-btn>

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
import { spinalConfigurationService } from "../../../../services";

import SelectItem from "./mdSelect.vue";
import CreateItem from "./createItem.vue";
import ConfigurationsComponent from "./configurations.vue";

export default {
  name: "configuration-template",
  props: {
    currentConfiguration: {}
  },
  components: {
    "create-item": CreateItem,
    "select-item": SelectItem,
    "configuration-component": ConfigurationsComponent
  },
  data() {
    return {
      item: {
        categorySelected: "",
        categories: [],
        groupSelected: "",
        groups: [],
        configurationSelected: "",
        configurations: []
      }
    };
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
      this.item.categorySelected = id;
      const groups = await spinalConfigurationService.getGroups(id);
      this.item.groups = groups.map(el => el.get());

      // init group && configuration
      this.item.groupSelected = undefined;
      this.item.configurationSelected = undefined;
      // end
    },

    async selectGroup(id) {
      this.item.groupSelected = id;
      const configurations = await spinalConfigurationService.getConfigurations(
        id
      );
      this.item.configurations = configurations.map(el => el.get());

      // init configuration
      this.item.configurationSelected = undefined;
      //end
    },

    async selectConfiguration(id) {
      this.item.configurationSelected = id;
    },

    currentConf() {
      this.$emit("currentConf");
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
</style>


<style>
._container .fabs .mdSpeedDialBtn .md-button .md-ripple {
  width: 250px;
}

._container
  .fabs
  .md-speed-dial.md-direction-top.md-effect-fling
  .md-speed-dial-content
  .md-button {
  background-color: #448aff;
  color: white;
}
</style>
