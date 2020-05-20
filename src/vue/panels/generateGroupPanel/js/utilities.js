import CREATE_DATA from "./data.js";
import {
  spinalAttributeService
} from "../../../../services";
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import groupManagerService from "spinal-env-viewer-plugin-group-manager-service";
import geographicService from "spinal-env-viewer-context-geographic-service";

export default {
  async getValue(spinalId, info, type) {

    if (info.createBy === CREATE_DATA.attribute) {
      return this.checkOnSpinalAttributes(spinalId, info.regex, type);

    } else if (info.createBy === CREATE_DATA.name) {
      const nodeInfo = SpinalGraphService.getInfo(spinalId);
      const name = nodeInfo.name.get();

      if (info.separator.length === 0) return;

      const liste = name.split(info.separator);

      return liste[info.index - 1];
    }

  },

  async checkOnBimObjectAttributes(spinalId, regex) {},

  async checkOnSpinalAttributes(spinalId, regex, type) {
    const attributes = await spinalAttributeService.getAllAttributes(
      spinalId);

    const found = attributes.find((el) => {
      return el.label.match(regex);
    });

    if (found && found.value) return found.value;
    else if (type === geographicService.constants.EQUIPMENT_TYPE) {
      const found = await this.checkOnBimObjectAttributes(spinalId, regex);
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
    return groupManagerService.addGroup(
      contextId,
      categoryId,
      groupName,
      "#FFFFFF"
    );
  },

  addElement(contextId, groupId, elementId) {
    return groupManagerService.linkElementToGroup(
      contextId,
      groupId,
      elementId
    );
  },
};