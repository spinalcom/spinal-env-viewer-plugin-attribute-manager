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
   <div class="container" v-if="configurationData">
      <div class="header">

         <div class="name">
            <md-tooltip>{{ configurationData.name }}</md-tooltip>
            <span>{{ configurationData.name }}</span>
         </div>

         <div class="actions">
            <div class="editMode" v-if="editMode">
               <!-- <v-btn outline
                 color="#448aff">Add Category</v-btn> -->

               <!-- color="#448aff" -->

               <v-btn outline color="teal" @click="save">Save</v-btn>

               <v-btn outline color="#ff5252" @click="cancel">Cancel</v-btn>

               <menu-component @add="addAttributeCategory"></menu-component>
            </div>

            <div class="normalMode" v-else>
               <!-- #448aff -->
               <v-btn outline color="orange" @click="activeEditMode">Active edit Mode</v-btn>

               <v-btn outline color="#448aff" v-if="configurationSelected !== currentConfiguration"
                  @click="setAsCurrentConf">Set as Current Configuration</v-btn>

               <v-btn outline v-if="configurationSelected === currentConfiguration" color="teal"
                  @click="deleteAsCurrentConf">
                  <v-icon>check</v-icon>
                  Current Configuration
               </v-btn>

            </div>
         </div>
      </div>

      <div class="content">
         <display-list class="displayList md-scrollbar" :categories="configurationData.categories" :editMode="editMode"
            :message="'No Attribute category found !'" @add="addSubItem" @remove="removeItem">
         </display-list>
      </div>

   </div>
</template>

<script>
import DisplayList from "./displayList.vue";
import MenuComponent from "../../attributePanel/components/tooltips/addItem.vue";

import { spinalConfigurationService } from "../../../../services";
import EventBus from "../../../../js/events/events";

export default {
   name: "editConfiguration",
   components: {
      "display-list": DisplayList,
      "menu-component": MenuComponent,
   },
   props: {
      configurationSelected: {
         type: String,
         default: "",
      },
      currentConfiguration: {},
   },
   data() {
      return {
         configurationData: {
            name: "",
            categories: [],
         },
         editMode: false,
      };
   },
   mounted() {
      this.getConfiguration();
   },
   methods: {
      async getConfiguration() {
         if (this.configurationSelected) {
            this.configurationData = await spinalConfigurationService.getConfigurationById(
               this.configurationSelected
            );
         } else {
            this.configurationData = {
               name: "",
               categories: [],
            };
         }
      },

      activeEditMode() {
         this.editMode = true;
      },

      async setAsCurrentConf() {
         await spinalConfigurationService.setAsCurrentConfiguration(
            this.configurationSelected
         );
         this.$emit("getCurrentConf");
         this.refreshPanel();
      },

      async deleteAsCurrentConf() {
         await spinalConfigurationService.deleteCurrentConf();

         this.$emit("getCurrentConf");
         this.refreshPanel();
      },

      addAttributeCategory(res) {
         let found = this.configurationData.categories.find(
            (el) => el.name === res.category
         );

         if (!found) {
            this.configurationData.categories.push({
               id: Date.now(),
               name: res.category,
               attributes: [],
            });
         }
      },

      addSubItem(res) {
         if (res.category && res.label) {
            let found = this.configurationData.categories.find((el) => el.name === res.category);
            if (!found) return;

            let attrFound = found.attributes.find((el) => el.name === res.label);
            if (attrFound) return;

            found.attributes.push({
               show: true,
               name: res.label,
               id: Date.now(),
            });
         }
      },

      removeItem(res) {
         if (typeof res.attr === "undefined") {
            this.configurationData.categories = this.configurationData.categories.filter((el) => el.id !== res.category.id);
         } else {
            let found = this.configurationData.categories.find((el) => el.id === res.category.id);

            if (found) {
               found.attributes = found.attributes.filter((el) => el.id !== res.attr.id);
            }
         }
      },

      cancel() {
         this.editMode = false;
         this.getConfiguration();
      },

      async save() {
         this.editMode = false;
         await spinalConfigurationService.editConfiguration(
            this.configurationSelected,
            this.configurationData
         );

         this.refreshPanel();
      },

      refreshPanel() {
         EventBus.$emit("refreshTable");
      },
   },
   watch: {
      configurationSelected: function () {
         this.getConfiguration();
      },
   },
};
</script>

<style scoped>
.container {
   width: 100%;
   height: 100%;
   padding: 0;
   overflow: hidden;
}

.container .header {
   width: 100%;
   height: 50px;
   display: flex;
   justify-content: space-between;
}

.container .header .name {
   width: 30%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 0 5px 0 5px;
   font-size: 1.5em;
}

.container .header .name span {
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}

.container .header .actions {
   /* width: 60%; */
   height: 100%;
   flex: 1 0 60%;
   display: flex;
   justify-content: flex-end;
   flex-wrap: nowrap;
}

.container .header .actions .editMode,
.container .header .actions .normalMode {
   display: flex;
   flex-wrap: nowrap;
}

.container .content {
   width: 100%;
   height: calc(100% - 50px);
   overflow: hidden;
}

.container .content .displayList {
   width: 100%;
   height: 100%;
   overflow: hidden;
   overflow-y: auto;
}
</style>
