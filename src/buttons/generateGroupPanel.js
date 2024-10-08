import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import { SpinalGraphService, SpinalContext } from "spinal-env-viewer-graph-service";
import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

const SIDEBAR = "GraphManagerSideBar";


export default class OpenSelectTypePanel extends SpinalContextApp {
  constructor() {
    super("open Generate group  panel",
      "open Generate group panel", {
      icon: "select_all",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    })
  }

  isShown(option) {
    const selectedNode = SpinalGraphService.getRealNode(option.selectedNode.id
      .get());

    if (selectedNode instanceof SpinalContext)
      return Promise.resolve(true);

    return Promise.resolve(-1);
  }


  action(option) {
    spinalPanelManagerService.openPanel("selectTypeDialog", option
      .selectedNode.get());
  }

}

const OPEN_SELECT_TYPE_BTN = new OpenSelectTypePanel();
spinalContextMenuService.registerApp(SIDEBAR, OPEN_SELECT_TYPE_BTN, [3]);


export { OPEN_SELECT_TYPE_BTN };