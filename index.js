import "./src/js/register";

import {
  OPEN_PANEL_BTN
} from "./src/buttons";

import {
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";


const SIDEBAR = "GraphManagerSideBar";


spinalContextMenuService.registerApp(SIDEBAR, new OPEN_PANEL_BTN(), [3]);