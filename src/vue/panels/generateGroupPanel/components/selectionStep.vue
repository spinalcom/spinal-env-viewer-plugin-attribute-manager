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
  <div class="sub-content">

    <div class="countdiv typeSelected">
      Type selected : {{type ? type : "None"}}
    </div>

    <div class="countdiv">
      {{count}} item(s) selected
    </div>

    <div class="buttons">
      <md-button @click="addSelection">
        <md-icon>add</md-icon>
        <md-tooltip md-delay="300">Add Bim objects selected</md-tooltip>
      </md-button>

      <md-button @click="clearReferential">
        <md-icon>clear</md-icon>
        <md-tooltip md-delay="300">Clear selected</md-tooltip>
      </md-button>

      <!-- <md-button @click="showReferential">
        <md-icon>visibility</md-icon>
        <md-tooltip md-delay="300">Show referential</md-tooltip>
      </md-button> -->
    </div>

  </div>
</template>

<script>
import geographicService from "spinal-env-viewer-context-geographic-service";
import { bimObjectManagerService } from "spinal-env-viewer-bim-manager-service";

export default {
  name: "selectionStep",
  props: {
    data: {},
    type: {}
  },
  data() {
    return {};
  },
  methods: {
    addSelection() {
      const EQUIPMENT_TYPE = geographicService.constants.EQUIPMENT_TYPE;

      if (this.type === EQUIPMENT_TYPE || this.data.items.length === 0) {
        if (this.data.items.length === 0)
          this.$emit("changeType", EQUIPMENT_TYPE);

        this.addItemSelected();
      } else {
        window.alert(`can not add ${EQUIPMENT_TYPE} to ${this.type} type`);
      }
    },

    clearReferential() {
      this.data.items = [];
      this.$emit("changeType");
    },

    async addItemSelected() {
      const aggregateSelection = window.spinal.ForgeViewer.viewer.getAggregateSelection();

      const selection = await this.getLeafDbIds(aggregateSelection);

      const nodespromises = selection.map(async el => {
        return this.getBimObjectsNodes(el);
      });

      let promisesValues = await Promise.all(nodespromises);

      for (const iterator of promisesValues) {
        const listeFiltered = this.filterList(iterator);
        this.data.items = [...this.data.items, ...listeFiltered];
      }
    },

    getLeafDbIds(selections) {
      const dbIds = selections.map(el => {
        return bimObjectManagerService.getLeafDbIds(el.model, el.selection);
      });

      return Promise.all(dbIds);
    },

    getBimObjectsNodes(el) {
      let nodes = el.selection.map(async dbId => {
        let node = await window.spinal.BimObjectService.createBIMObject(
          dbId,
          el.model
        );
        return node.get();
      });

      return Promise.all(nodes);
    },

    filterList(liste) {
      return liste.filter(el => {
        const found = this.data.items.find(i => i.id === el.id);
        if (found) return false;
        return true;
      });
    }
  },
  computed: {
    count() {
      return this.data && this.data.items ? this.data.items.length : 0;
    }
  }
};
</script>

<style scoped>
.countdiv {
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 1.2em;
}
</style>

<style>
.sub-content .buttons .md-button .md-ripple {
  padding: 0px !important;
}
</style>