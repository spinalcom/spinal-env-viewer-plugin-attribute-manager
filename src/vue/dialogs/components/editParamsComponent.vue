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
  <div class="list">

    <div v-if="!editMode" class="md-layout md-alignment-space-between header">

      <div class="md-layout-item md-size-55">
        <md-field>
          <label for="movie">Select configuration</label>
          <md-select v-model="configurationSelected" name="configuration" id="configuration">
            <md-option v-for="(configuration, index) in data" :key="index" :value="configuration.id">{{
              configuration.name }}
            </md-option>

          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-size-40">
        <v-btn outline v-if="!isCurrentConfiguration()" @click="setAsCurrentConfiguration"
          :disabled="!configurationSelected" color="blue">Set as current configuration</v-btn>

        <v-alert :value="true" v-if="isCurrentConfiguration()" color="green" outline icon="check_circle">
          current configuration.
        </v-alert>
      </div>

    </div>

    <div v-if="configurationSelected" class="content" :class="{ 'contentWithOutHeader': editMode }">
      <div class="header">
        <div>{{ configurationData.name }}</div>

        <div class="buttons">
          <v-btn fab blue outline small color="red" v-if="editMode" @click="activeEditMode(false)">
            <v-icon>close</v-icon>
          </v-btn>

          <v-btn fab blue outline small color="blue" @click="activeEditMode(true)">
            <v-icon>{{ editMode ? "check" : "edit" }}</v-icon>
          </v-btn>
        </div>
      </div>

      <display-list-component class="content md-scrollbar" :categories="configurationData.categories"
        :editMode="editMode" :message="'No category found create. Create one with the button below !'" @add="addSubItem"
        @remove="removeItem">
      </display-list-component>

      <div class="header">
        <menu-component class="addCat" v-if="editMode" @add="addCategory"></menu-component>

      </div>
    </div>

  </div>
</template>

<script>
// import menuComponent from "../../../vue/panels/components/tooltips/addItem.vue";

import displayListComponent from "../components/displayList.vue";
import menuComponent from "../../../vue/panels/attributePanel/components/tooltips/addItem.vue";

import Utilities from "../../../js/utils/utilities";

export default {
  name: "editParamsComponent",
  components: {
    "menu-component": menuComponent,
    "display-list-component": displayListComponent
  },
  props: {
    data: {
      default: new Array()
    },
    currentConfiguration: {}
  },
  data() {
    this.copyItem;
    return {
      editMode: false,
      configurationSelected: undefined,
      configurationData: {
        name: "",
        categories: []
      }
    };
  },
  mounted() {
    // console.log("this.currentConfiguration", this.currentConfiguration);
  },
  methods: {
    async activeEditMode(edit) {
      this.editMode = !this.editMode;

      if (!this.editMode && edit) {
        await Utilities.editConfiguration(this.configurationSelected, this.configurationData);
        this.$emit("refresh");

      } else if (!this.editMode && !edit) {
        // console.log("cancel edit", this.copyItem);
        this.configurationData = JSON.parse(JSON.stringify(this.copyItem));
      }
    },

    async setAsCurrentConfiguration() {
      await Utilities.setAsCurrentConfiguration(this.configurationSelected);
      this.$emit("change");
    },

    isCurrentConfiguration() {
      if (!this.configurationSelected) return false;

      if (this.currentConfiguration && this.currentConfiguration.id === this.configurationSelected)
        return true;

      return false;
    },

    addSubItem(res) {
      if (!res.category || !res.label) return;

      let found = this.configurationData.categories.find(el => el.name === res.category);

      if (!found) return; // category not found

      let attrFound = found.attributes.find(el => el.name === res.label);
      if (attrFound) return; // attribute already exist in category

      found.attributes.push({ show: false, name: res.label, id: Date.now() });
    },

    removeItem(res) {
      // delete category
      if (!res.attr) {
        this.configurationData.categories = this.configurationData.categories.filter(el => el.id !== res.category.id);
        return;
      }



      // else delete attribute
      let found = this.configurationData.categories.find(el => el.id === res.category.id);

      if (found) {
        found.attributes = found.attributes.filter(el => el.id !== res.attr.id);
      }

    },

    addCategory(res) {
      let found = this.configurationData.categories.find(el => el.name === res.category);

      if (found) return; // category already exist

      this.configurationData.categories.push({
        id: Date.now(),
        name: res.category,
        attributes: []
      });
    }
  },
  watch: {
    configurationSelected() {
      let found = this.data.find(el => el.id === this.configurationSelected);
      this.configurationData = JSON.parse(JSON.stringify(found));
      this.copyItem = JSON.parse(JSON.stringify(found));
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

.list .header {
  height: 80px;
  align-items: center;
  justify-content: space-between;
}

.list .content {
  width: 100%;
  height: calc(100% - 80px);
}

.list .content.contentWithOutHeader {
  width: 100%;
  height: 100%;
}

.list .content .content {
  width: 100%;
  height: calc(100% - 120px);
}

.list .content .header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 20px;
  text-transform: uppercase;
  justify-content: space-between;
}

.list .content .header .addCat {
  border: 1px solid #448aff;
}

.list .content .header .buttons {
  display: flex;
  flex-direction: row;
}

/* .mdDialogContainer.paramsDialogContainer .list .emptyList {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
} */
</style>

<style>
.list .content .content .myListContainer .v-list.listContainer.theme--dark {
  overflow: auto;
}
</style>