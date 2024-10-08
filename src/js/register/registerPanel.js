import Vue from "vue";
const { SpinalForgeExtention } = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");

import attributePanel from "../../vue/panels/attributePanel/panel.vue";
import configurationPanel from "../../vue/panels/configurationPanel/configurationPanel.vue";
import generateGroupPanel from "../../vue/panels/generateGroupPanel/panel.vue";


let panels = [{
    name: "attributeManagerPanel",
    vueMountComponent: Vue.extend(attributePanel),
    panel: {
        title: "Attribute manager",
        closeBehaviour: "hide"
    },
    style: {
        minWidth: "620px",
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
}, {
    name: "generateGroupPanel",
    vueMountComponent: Vue.extend(generateGroupPanel),
    panel: {
        title: "Generate Group Panel",
        closeBehaviour: "hide"
    },
    style: {
        minWidth: "620px",
        height: "740px",
        left: "400px"
    }
}]

for (let index = 0; index < panels.length; index++) {
    const element = panels[index];
    const panelExtension = SpinalForgeExtention.createExtention(element);
    SpinalForgeExtention.registerExtention(element.name, panelExtension);
}

