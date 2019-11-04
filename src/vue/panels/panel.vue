<template>
  <md-content class="mdContainer md-scrollbar">

    <type-lst-component v-if="data && visiblePage === pages.types"
                        :types="data.types"
                        @select="selectType">
    </type-lst-component>

    <table-component v-if="typeSelected && visiblePage === pages.table"
                     :itemDisplayed="itemDisplayed"
                     :attributesDisplayed="attributesDisplayed"
                     @back="goBack">
    </table-component>

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
import TableComponent from "./components/table.vue";

import SpinalAttributeManager from "../../services";

export default {
  name: "attributeManagerPanel",
  components: {
    "type-lst-component": TypeLstComponent,
    "table-component": TableComponent
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
      itemDisplayed: null,
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
      this.attributesDisplayed = this.data.attributes;
      this.visiblePage = this.pages.table;
    },
    goBack() {
      this.typeSelected = null;
      this.visiblePage = this.pages.types;
    }
  },
  watch: {
    itemSelected() {
      this.appState = this.STATES.loading;
      this.getAllData()
        .then(res => {
          this.data = res;
          this.appState = this.STATES.normal;
        })
        .catch(() => {
          this.appState = this.STATES.normal;
        });
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