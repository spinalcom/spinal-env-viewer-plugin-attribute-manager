<template>
  <md-content class="mdContainer md-scrollbar">

    <type-lst-component v-if="data && appState === STATES.normal && visiblePage === pages.types"
                        :types="data.types"
                        @select="selectType">
    </type-lst-component>

    <table-page v-if="appState === STATES.normal && typeSelected && visiblePage === pages.table"
                :itemDisplayed="itemDisplayed"
                :attributesDisplayed="attributesDisplayed"
                @back="goBack"
                @refresh="validateItem">
    </table-page>

    <!--
          /////////////////////////////////
          Loading
          ////////////////////////////////
        -->
    <div v-if="appState === STATES.loading"
         class="loading">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
  </md-content>
</template>

<script>
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import TypeLstComponent from "./components/typesList.vue";
import TablePage from "./components/tablePage.vue";

import SpinalAttributeManager from "../../services";

export default {
  name: "attributeManagerPanel",
  components: {
    "type-lst-component": TypeLstComponent,
    "table-page": TablePage
  },
  data() {
    this.STATES = Object.freeze({
      normal: 0,
      loading: 1,
      error: 2
    });

    this.pages = Object.freeze({
      types: 0,
      table: 1
    });

    this.data = null;

    return {
      appState: this.STATES.normal,
      itemSelected: null,
      contextSelected: null,
      typeSelected: null,
      visiblePage: this.pages.types,
      itemDisplayed: null
      // attributesDisplayed: []
    };
  },
  methods: {
    opened(params) {
      this.itemSelected = params.nodeSelected;
      this.contextSelected = params.context;
    },
    setTitle(title) {
      spinalPanelManagerService.panels.networkTreeDetailPanel.panel.setTitle(
        title
      );
    },
    getAllData() {
      return SpinalAttributeManager.getAllData(
        this.contextSelected.id,
        this.itemSelected.id
      );
    },
    selectType(type) {
      this.typeSelected = type;
      this.itemDisplayed = this.data.data[type];
      // this.attributesDisplayed = this.data.attributes;
      // this.attributesDisplayed = this.getAttributes();
      this.visiblePage = this.pages.table;
    },

    getAttributes() {
      return this.data.data[this.typeSelected]
        .map(el => {
          return el.attributes.map(el2 => {
            return { category: el2.category, label: el2.label };
          });
        })
        .flat();
    },

    goBack() {
      this.typeSelected = null;
      this.visiblePage = this.pages.types;
    },

    validateItem() {
      // setTimeout(() => {
      this.refreshData();
      // }, 500);
    },

    refreshData() {
      this.appState = this.STATES.loading;
      this.getAllData()
        .then(res => {
          this.data = res;

          console.log("data", this.data);

          if (this.typeSelected) {
            this.selectType(this.typeSelected);
          }

          this.appState = this.STATES.normal;
        })
        .catch(err => {
          this.appState = this.STATES.normal;
          console.error(err);
        });
    }
  },
  watch: {
    itemSelected() {
      this.refreshData();
    }
  }
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