import CREATE_DATA from "./data.js";

import {
  spinalAttributeService
} from "../../../../services";

import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";


import {
  bimObjectManagerService
} from "spinal-env-viewer-bim-manager-service";

import groupManagerService from "spinal-env-viewer-plugin-group-manager-service";
import geographicService from "spinal-env-viewer-context-geographic-service";

export default {
  async getValue(spinalId, info, type) {

    if (info.createBy === CREATE_DATA.attribute) {
      return this.checkOnSpinalAttributes(spinalId, info.regex, type);

    } else if (info.createBy === CREATE_DATA.name) {
      const nodeInfo = SpinalGraphService.getInfo(spinalId);
      const name = nodeInfo.name.get();

      if (info.separator.length === 0) info.separator = " ";

      const liste = name.split(info.separator);

      return liste[info.index - 1];
    } else if (info.createBy === CREATE_DATA.fixed) {
      return info.fixedValue;
    }

  },

  async checkOnBimObjectAttributes(spinalId, regex) {
    const bimObjectInfo = SpinalGraphService.getInfo(spinalId).get();

    let model = window.spinal.BimObjectService.getModelByBimfile(bimObjectInfo
      .bimFileId);

    if (model) {
      return bimObjectManagerService.getBimObjectProperties({
        model: model,
        selection: [bimObjectInfo.dbid]
      }).then(res => {
        let properties = res[0].properties[0].properties;

        let found = properties.find(el => {
          let attrName = el.attributeName.toLowerCase();
          let displayName = el.displayName.toLowerCase();

          return attrName.match(this._getRegex(regex.toString())) ||
            displayName.match(this._getRegex(regex.toString()));
        })

        if (found) return found.displayValue;


      }).catch(err => {
        console.error(err);
        return;
      })
    }

  },

  async checkOnSpinalAttributes(spinalId, regex, type) {

    const attributes = await spinalAttributeService.getAllAttributes(
      spinalId);

    const found = attributes.find((el) => {
      return el.label.match(this._getRegex(regex.toString()));
    });

    if (found && found.value) return found.value;

    else if (type === geographicService.constants.EQUIPMENT_TYPE) {
      const attrValue = await this.checkOnBimObjectAttributes(spinalId,
        regex);
      return attrValue;
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

  createGroup(contextId, categoryId, groupName, color = "#000000") {
    return groupManagerService.addGroup(
      contextId,
      categoryId,
      groupName,
      color
    );
  },

  addElement(contextId, groupId, elementId) {
    return groupManagerService.linkElementToGroup(
      contextId,
      groupId,
      elementId
    );
  },

  _getValidContextName(name) {
    let validName;
    let count = 0;
    while (typeof validName === "undefined") {
      if (!this.contextNameExist(name)) {
        validName = name;
      } else {
        count++;
        name = `${name} ${count}`
      }
    }

    return validName;
  },

  _getRegex(inputstring) {
    var match = inputstring.match(new RegExp("^/(.*?)/([gimyu]*)$"));
    if (match) return new RegExp(match[1], match[2]);
    return "";
  }
};