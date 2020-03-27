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
  <div>
    <md-button v-for="(btn,index) in buttons"
               :key="index"
               @click="btn.action"
               class="md-icon-button md-primary">

      <md-tooltip>{{btn.name}}</md-tooltip>
      <md-icon>{{btn.icon}}</md-icon>

    </md-button>
  </div>
</template>

<script>
import EventBus from "../../../../js/events/events.js";

export default {
  name: "standardButton",
  props: { itemsSelected: {} },
  data() {
    this.buttons = [
      { name: "isolate", icon: "settings_overscan", action: this.isolate },
      { name: "select BIM Objects", icon: "devices", action: this.select },
      { name: "zoom", icon: "zoom_in", action: this.zoom }
    ];
    return {};
  },
  methods: {
    select() {
      const ids = this.itemsSelected.map(el => el.id);
      if (ids.length > 0) {
        EventBus.$emit("select", ids);
      } else {
        alert("no item selected");
      }
    },
    isolate() {
      const ids = this.itemsSelected.map(el => el.id);

      if (ids.length > 0) {
        EventBus.$emit("isolate", ids);
      } else {
        alert("no item selected");
      }
    },
    zoom() {
      const ids = this.itemsSelected.map(el => el.id);

      if (ids.length > 0) {
        EventBus.$emit("fitToView", ids);
      } else {
        alert("no item selected");
      }
    }
  }
};
</script>