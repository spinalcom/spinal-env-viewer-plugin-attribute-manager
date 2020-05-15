import CREATE_DATA from "./data.js";
import {
  spinalAttributeService
} from "../../../../services";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import groupManagerService from "spinal-env-viewer-plugin-group-manager-service";


export default {
  async getValue(spinalId, regex, type, searchBy = CREATE_DATA.attribute) {
    if (searchBy === CREATE_DATA.attribute) {
      return this.checkOnSpinalAttributes(spinalId, regex, type);
    }
  },

  async checkOnBimObjectAttributes(spinalId, regex) {},

  async checkOnSpinalAttributes(spinalId, regex, type) {
    const attributes = await spinalAttributeService.getAllAttributes(
      spinalId
    );

    const found = attributes.find(el => {
      return el.label.match(regex);
    });

    if (found && found.value) return found.value;
    else if (type === "BIMObject") {
      const found = await this.checkOnBimObjectAttributes(spinalId,
        regex);
    }
  },

  ////////////////////////////////////////////////////////////////
  //                    Creation                                //
  ////////////////////////////////////////////////////////////////

  contextNameExist(contextName) {
    const context = SpinalGraphService.getContext(contextName);
    if (typeof context !== "undefined") return true;
    return false;
  },

  createCategory(contextId, categoryName) {
    return groupManagerService.addCategory(contextId, categoryName, "");
  },

  createGroup(contextId, categoryId, groupName) {
    return groupManagerService.addGroup(contextId, categoryId, groupName,
      "#FFFFFF");
  },

  addElement(contextId, groupId, elementId) {
    return groupManagerService.linkElementToGroup(contextId, groupId,
      elementId);
  }

}