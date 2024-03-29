import "./src/js/events/eventRecepter";
import "./src/js/register";

import { OPEN_PANEL_BTN, OPEN_CONFIGURATION_PANEL } from "./src/buttons";

import { OPEN_SELECT_TYPE_BTN } from "./src/vue/panels/generateGroupPanel/buttons";

import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

const SIDEBAR = "GraphManagerSideBar";

spinalContextMenuService.registerApp(SIDEBAR, new OPEN_PANEL_BTN(), [3]);
spinalContextMenuService.registerApp(SIDEBAR, new OPEN_CONFIGURATION_PANEL(), [
  3,
]);

spinalContextMenuService.registerApp(SIDEBAR, new OPEN_SELECT_TYPE_BTN(), [3]);
