import Vue from "vue";
import attributePanel from "../vue/panels/panel.vue";

const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");



//////////////////////////////////////////////////////////////////////////////////
// register Panels
/////////////////////////////////////////////////////////////////////////////////



let panels = [{
  name: "attributeManagerPanel",
  vueMountComponent: Vue.extend(attributePanel),
  panel: {
    title: "Attribute manager",
    closeBehaviour: "hide"
  },
  style: {
    height: "475px",
    left: "400px"
  }
}]

for (let index = 0; index < panels.length; index++) {
  const element = panels[index];
  const panelExtension = SpinalForgeExtention.createExtention(element);
  SpinalForgeExtention.registerExtention(element.name, panelExtension);
}