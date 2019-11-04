import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

export default class OpenAttributeManagerPanel extends SpinalContextApp {
  constructor() {
    super("open attribute manager panel", "open attribute manager panel", {
      icon: "power_input",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    })
  }

  isShown() {
    return Promise.resolve(true);
  }


  action(option) {
    let params = {
      nodeSelected: option.selectedNode.get(),
      context: option.context.get()
    };
    spinalPanelManagerService.openPanel("attributeManagerPanel", params);
  }

}