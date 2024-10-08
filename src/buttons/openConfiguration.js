import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import { spinalConfigurationService } from '../services';

import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

const SIDEBAR = "GraphManagerSideBar";

export default class OpenConfigurationPanel extends SpinalContextApp {

  constructor() {
    super("open configuration manager panel",
      "open configuration manager panel", {
      icon: "settings_applications",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    })
  }

  isShown(option) {
    const nodeType = option.context.type.get();

    const configContextType = `${spinalConfigurationService.CONFIGURATION_PROFIL_TYPE}GroupContext`;

    if (nodeType === configContextType) {
      return Promise.resolve(true);
    }

    return Promise.resolve(-1);

  }


  async action(option) {

    const contextInfo = option.context.get();
    const selectedNode = option.selectedNode.get();

    let params = {}

    if (contextInfo.id !== selectedNode.id) {
      params = await spinalConfigurationService.getTree(selectedNode);
    }

    spinalPanelManagerService.openPanel("configurationPanel", params);
  }

}


const OPEN_CONFIGURATION_PANEL = new OpenConfigurationPanel();
spinalContextMenuService.registerApp(SIDEBAR, OPEN_CONFIGURATION_PANEL, [3]);


export { OPEN_CONFIGURATION_PANEL };