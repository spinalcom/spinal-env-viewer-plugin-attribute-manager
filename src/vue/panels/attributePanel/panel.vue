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
   <md-content class="mdContainer md-scrollbar">

      <type-lst-component v-if="allNodesTree && appState === STATES.normal && visiblePage === pages.types"
         :types="allNodesTree.types" @select="selectType">
      </type-lst-component>

      <!-- :attributesDisplayed="attributesDisplayed" -->
      <table-page v-if="appState === STATES.normal && typeSelected && visiblePage === pages.table"
         :itemDisplayed="itemDisplayed" :typeSelected="typeSelected" @back="goBack" @refresh="validateItem"
         @openExportDialog="openExportDialog">
      </table-page>

      <!--
          /////////////////////////////////
          Loading
          ////////////////////////////////
        -->
      <div v-if="appState === STATES.loading" class="loading">
         <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>
   </md-content>
</template>

<script>
const {
   spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

import TypeLstComponent from "./components/typesList.vue";
import TablePage from "./components/tablePage.vue";

import SpinalAttributeManager from "../../../services";

import EventBus from "../../../js/events/events";

export default {
   name: "attributeManagerPanel",
   components: {
      "type-lst-component": TypeLstComponent,
      "table-page": TablePage,
   },
   mounted() {
      EventBus.$on("refreshTable", () => {
         this.refreshData();
      });
   },
   data() {
      this.STATES = Object.freeze({
         normal: 0,
         loading: 1,
         error: 2,
      });

      this.pages = Object.freeze({
         types: 0,
         table: 1,
      });

      this.allNodesTree = null;

      return {
         appState: this.STATES.normal,
         itemSelected: null,
         contextSelected: null,
         typeSelected: null,
         visiblePage: this.pages.types,
         itemDisplayed: null,
         // attributesDisplayed: []
      };
   },
   methods: {
      opened(params) {
         this.itemSelected = params.nodeSelected;
         this.contextSelected = params.context;
      },

      closed() { },

      setTitle(title) {
         spinalPanelManagerService.panels.attributeManagerPanel.panel.setTitle(title);
      },

      getAllData() {
         return SpinalAttributeManager.getAllData(this.contextSelected.id, this.itemSelected.id);
      },

      selectType(type) {
         this.typeSelected = type;
         this.itemDisplayed = this.allNodesTree.data[type];
         // this.attributesDisplayed = this.allNodesTree.attributes;
         // this.attributesDisplayed = this.getAttributes();
         this.visiblePage = this.pages.table;
      },

      getAttributes() {
         return this.allNodesTree.data[this.typeSelected].reduce((list, el) => {
            for (const attribute of el.attributes) {
               list.push({ category: attribute.category, label: attribute.label });
            }

            return list;
         }, [])
      },

      goBack() {
         this.typeSelected = null;
         this.visiblePage = this.pages.types;
      },

      validateItem() {
         this.refreshData();
      },

      async refreshData() {

         try {
            this.appState = this.STATES.loading;
            this.allNodesTree = await this.getAllData();

            const typeFound = this.allNodesTree.types.find((el) => el === this.typeSelected);
            this.typeSelected = typeFound ? typeFound : null;

            if (this.typeSelected) this.selectType(this.typeSelected);
            else this.visiblePage = this.pages.types;

            this.appState = this.STATES.normal;
         } catch (error) {
            this.appState = this.STATES.normal;
            console.error(err);
         }

      },

      openExportDialog(res) {
         this.appState = this.STATES.loading;

         spinalPanelManagerService.openPanel("importAttributeExcelDialog", {
            tableData: res.table,
            excelData: res.data,
            callback: () => {
               this.refreshData();
            },
         });
      },
   },
   watch: {
      itemSelected() {
         this.setTitle(`Attribute Manager : ${this.itemSelected.name}`);
         this.refreshData();
      },
   },
};
</script>

<style scoped>
.mdContainer {
   width: 100%;
   height: calc(100% - 20px);
   overflow: auto;
   background: transparent;
}

.loading {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
}
</style>