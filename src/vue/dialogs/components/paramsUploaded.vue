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
  <div class="list" v-if="configurationCopy">

    <div class="header">
      <div>{{ configurationCopy.name }}</div>
    </div>

    <display-list-component class="content md-scrollbar" :categories="configurationCopy.categories" :editMode="true"
      :message="'No category found create. Create one with the button below !'" @add="addSubItem" @remove="removeItem">
    </display-list-component>

    <div class="header">
      <menu-component class="addCatBtn" @add="addCategory"></menu-component>

      <v-btn outline color="#2196f3" @click="updateConfiguration">
        <v-icon dark>check</v-icon>
        &nbsp;
        Save Modification
      </v-btn>

    </div>

  </div>

  <div class="empty" v-else>
    No configuration is set yet !
  </div>

</template>

<script>
import displayListComponent from "../components/displayList.vue";
import menuComponent from "../../../vue/panels/attributePanel/components/tooltips/addItem.vue";

import Utilities from "../../../js/utils/utilities";

export default {
  name: "currentParams",
  components: {
    "menu-component": menuComponent,
    "display-list-component": displayListComponent
  },
  props: {
    currentConfiguration: {}
  },
  data() {
    return {
      configurationCopy: {}
    };
  },
  mounted() {
    this.configurationCopy = Object.assign({}, this.currentConfiguration);
  },
  methods: {
    async updateConfiguration() {
      await Utilities.editConfiguration(this.configurationCopy.id, this.configurationCopy);
      this.$emit("refresh");
    },

    addCategory(res) {
      let category = this.getCategory(res.category);
      if (category) return;

      this.configurationCopy.categories.push({ id: Date.now(), name: res.category, attributes: [] });
    },

    addSubItem(res) {
      let category = this.getCategory(res.category);
      if (!category) return; // category not found

      let attrFound = this.getAttributeFromCategory(category, res.label);
      if (attrFound) return; // attribute already exist


      category.attributes.push({
        show: false,
        name: res.label,
        id: Date.now()
      });
    },

    removeItem(res) {
      const isCategory = typeof res.attr === "undefined";

      // remove category
      if (isCategory) {
        this.configurationCopy.categories = this.configurationCopy.categories.filter(el => el.id !== res.category.id);
        return;
      }

      // remove attribute
      let found = this.configurationCopy.categories.find(el => el.id === res.category.id);
      if (!found) return;

      found.attributes = found.attributes.filter(el => el.id !== res.attr.id);
    },

    getCategory(categoryName) {
      if (!categoryName) return;
      return this.configurationCopy.categories.find(el => el.name === categoryName || el.id === categoryName);
    },

    getAttributeFromCategory(category, attributeName) {
      if (!category || !attributeName) return;
      return category.attributes.find(el => el.name === attributeName || el.id === attributeName);
    }
  },
  watch: {
    currentConfiguration() {
      this.configurationCopy = Object.assign({}, this.currentConfiguration);
    }
  }
};
</script>

<style scoped>
.list {
  width: 100%;
  height: 100%;
  /* border: 1px solid red; */
}

.list .content {
  width: 100%;
  height: calc(100% - 120px);
  overflow: hidden;
  overflow-y: auto;
}

.list .header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 20px;
  text-transform: uppercase;
  align-items: center;
  justify-content: space-between;
}

.list .header .buttonsDiv {
  display: flex;
  flex-direction: row;
}

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
</style>

<style>
.list .header .addCatBtn .md-ripple {
  border: 1px solid #2196f3;
}
</style>