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

    <!-- <md-list :md-expand-single="false">
      <md-list-item v-for="(item,index) in data"
                    :key="index"
                    md-expand>

        <span class="md-list-item-text">{{item.category}}</span>

        <menu-component :category="item.category"
                        @add="addLabel"></menu-component>

        <md-list slot="md-expand">
          <md-list-item class="md-inset"
                        v-for="(attr,i) in item.attributes"
                        :key="i">
            <md-checkbox class="md-primary"
                         v-model="attr.show" />
            <span class="md-list-item-text">{{attr.label}}</span>
          </md-list-item>

        </md-list>
      </md-list-item>
    </md-list>

    <menu-component class="addCategoryBtn"
                    @add="addLabel"></menu-component> -->

    <div v-if="!editMode"
         class="md-layout md-alignment-space-between header">

      <div class="md-layout-item md-size-55">
        <md-field>
          <label for="movie">Select configuration</label>
          <md-select v-model="configurationSelected"
                     name="configuration"
                     id="configuration">
            <md-option v-for="(configuration,index) in data"
                       :key="index"
                       :value="configuration.id">{{configuration.name}}
            </md-option>

          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-size-40">
        <v-btn outline
               v-if="!isCurrentConfiguration()"
               @click="setAsCurrentConfiguration"
               :disabled="!configurationSelected"
               color="blue">Set as current configuration</v-btn>

        <v-alert :value="true"
                 v-if="isCurrentConfiguration()"
                 color="green"
                 outline
                 icon="check_circle">
          current configuration.
        </v-alert>
      </div>

    </div>

    <div v-if="configurationSelected"
         class="content"
         :class="{'contentWithOutHeader' : editMode}">
      <div class="header">
        <div>{{configurationData.name}}</div>
        <v-btn fab
               blue
               outline
               small
               color="blue"
               @click="activeEditMode">
          <v-icon>{{editMode ? "check" : "edit"}}</v-icon>
        </v-btn>
      </div>

      <display-list-component class="content md-scrollbar"
                              :categories="configurationData.categories"
                              :editMode="editMode"
                              :message="'No category found create. Create one with the button below !'">
      </display-list-component>
    </div>

  </div>
</template>

<script>
// import menuComponent from "../../../vue/panels/components/tooltips/addItem.vue";

import displayListComponent from "../components/displayList.vue";
import Utilities from "../../../js/utilities";

export default {
  name: "editParamsComponent",
  components: {
    "display-list-component": displayListComponent
  },
  props: {
    data: {
      default: new Array()
    },
    currentConfiguration: {}
  },
  data() {
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
    console.log("this.currentConfiguration", this.currentConfiguration);
  },
  methods: {
    activeEditMode() {
      this.editMode = !this.editMode;
    },
    async setAsCurrentConfiguration() {
      await Utilities.setAsCurrentConfiguration(this.configurationSelected);
      this.$emit("change");
    },
    isCurrentConfiguration() {
      if (typeof this.configurationSelected === "undefined") return false;

      if (
        this.currentConfiguration &&
        this.currentConfiguration.id === this.configurationSelected
      )
        return true;

      return false;
    }
  },
  watch: {
    configurationSelected() {
      let found = this.data.find(el => el.id === this.configurationSelected);
      this.configurationData = found;
    }
  }
};
</script>

<style scoped>
.list {
  width: 100%;
  height: 100%; /* border: 1px solid red; */
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
  height: calc(100% - 60px);
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

/* .mdDialogContainer.paramsDialogContainer .list .emptyList {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
} */
</style>

<style >
.list .content .content .myListContainer .v-list.listContainer.theme--dark {
  overflow: auto;
}
</style>