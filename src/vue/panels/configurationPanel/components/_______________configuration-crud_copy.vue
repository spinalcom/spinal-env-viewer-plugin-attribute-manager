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
  <md-content class="mdContent md-scrollbar">
    <div class="section">

      <div class="title">
        <md-tooltip>Categories</md-tooltip>
        <span>Categories</span>
      </div>

      <div class="content">

        <create-item class="mdFab"
                     :title="'Create Category'"
                     :fieldText="'Category Name'"
                     @create="createCategory"></create-item>

        <display-list :itemSelected="item.categorySelected"
                      :data="item.categories"
                      @select="selectCategory"></display-list>

      </div>

    </div>

    <div class="section">

      <div class="title">
        <md-tooltip>Groups</md-tooltip>
        <span>Groups</span>
      </div>

      <div class="content">

        <create-item class="mdFab"
                     :title="'Create Group'"
                     :fieldText="'Group Name'"
                     @create="createGroup"></create-item>

        <!-- <md-button class="md-fab md-mini md-primary">
          <md-tooltip>Create Group</md-tooltip>
          <md-icon>add</md-icon>
        </md-button> -->

      </div>

    </div>

    <div class="section">

      <div class="title">
        <md-tooltip>Configuration Profil</md-tooltip>
        <span>Configuration Profil</span>
      </div>

      <div class="content">

        <create-item class="mdFab"
                     :title="'Create Configuration Profil'"
                     :fieldText="'Configuration Profil Name'"
                     @create="createConfiguration"></create-item>

        <!-- <md-button class="mdFab md-fab md-mini md-primary">
          <md-tooltip>Create Configuration Profil</md-tooltip>
          <md-icon>add</md-icon>
        </md-button> -->

      </div>

    </div>

    <div class="section"></div>

  </md-content>
</template>

<script>
import { spinalConfigurationService } from "../../../../services";

import CreateItem from "./createItem.vue";
import DisplayList from "./displayList.vue";

export default {
  name: "configuration-template",
  components: {
    "create-item": CreateItem,
    "display-list": DisplayList
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
    createGroup(name) {
      // console.log("create group", name);
    },
    createConfiguration(name) {
      // console.log("create configuration", name);
    },

    selectCategory(id) {
      this.item.categorySelected = id;
    }
  }
};
</script>

<style scoped>
.mdContent {
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  justify-content: space-between;
}

.mdContent .section {
  width: 30%;
  align-items: stretch;
  border: 1px solid grey;
  /* display: inline-flex; */
  /* position: relative; */
}

.mdContent .section .title {
  width: 100%;
  height: 10%;
  background: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mdContent .section .title span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.mdContent .section .content {
  width: 100%;
  height: 90%;
  position: relative;
}

.mdContent .section .content .mdFab {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>