import Vue from "vue";


////////////////////////////////////
//            Panels
////////////////////////////////////
import attributePanel from "../vue/panels/attributePanel/panel.vue";
import configurationPanel from "../vue/panels/configurationPanel/configurationPanel.vue";

////////////////////////////////////
//            Dialogs
////////////////////////////////////
import LinkToGroup from "../vue/dialogs/linkToGroup.vue";
import ParamDialogComponent from "../vue/dialogs/paramsDialog.vue";
import ImportAttributeExcelDialog from '../vue/dialogs/importAttributeExcelDialog.vue';

const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");

const {
  SpinalMountExtention
} = require("spinal-env-viewer-panel-manager-service");

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
}, {
  name: "configurationPanel",
  vueMountComponent: Vue.extend(configurationPanel),
  panel: {
    title: "Configuration Panel",
    closeBehaviour: "hide"
  },
  style: {
    minWidth: "620px",
    height: "475px",
    left: "400px"
  }
}]

for (let index = 0; index < panels.length; index++) {
  const element = panels[index];
  const panelExtension = SpinalForgeExtention.createExtention(element);
  SpinalForgeExtention.registerExtention(element.name, panelExtension);
}





//////////////////////////////////////////////////////////////////////////////////
// register Dialogs
/////////////////////////////////////////////////////////////////////////////////


const dialogs = [{
    name: "linkToGroupDialog",
    vueMountComponent: Vue.extend(LinkToGroup),
    parentContainer: document.body
  }, {
    name: "paramDialogComponent",
    vueMountComponent: Vue.extend(ParamDialogComponent),
    parentContainer: document.body
  },
  {
    name: "importAttributeExcelDialog",
    vueMountComponent: Vue.extend(ImportAttributeExcelDialog),
    parentContainer: document.body
  }
];


for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}