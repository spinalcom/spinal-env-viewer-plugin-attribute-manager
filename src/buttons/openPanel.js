import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

const SIDEBAR = "GraphManagerSideBar";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

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


const OPEN_PANEL_BTN = new OpenAttributeManagerPanel();
spinalContextMenuService.registerApp(SIDEBAR, OPEN_PANEL_BTN, [3]);

export { OPEN_PANEL_BTN };