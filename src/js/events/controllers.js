import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service"

import spinalGeographicService from "spinal-env-viewer-context-geographic-service";


import {
  groupService
} from "spinal-env-viewer-room-manager/services/service";


export default {

  async selectitemInViewer(nodeId) {
    const nodeInfo = SpinalGraphService.getInfo(nodeId);

    if (nodeInfo && this._isBimobjectOrRoom(nodeInfo.type.get())) {
      const bimObjects = await this._getBimObjects(nodeInfo);
      const objecs = this._organizeBimObject(bimObjects);

      objecs.forEach(el => {
        let model = window.spinal.BimObjectService
          .mappingBimFileIdModelId[el.bimFileId];

        for (let j = 0; j < model.modelScene.length; j++) {
          const scene = model.modelScene[j];
          // window.spinal.ForgeViewer.viewer.impl.selector
          //   .setAggregateSelection({
          //     model: scene.model,
          //     ids: el.selection
          //   })

          spinal.ForgeViewer.viewer.impl.selector.setSelection(el
            .selection, scene.model)

        }

      })

    }


  },



  ////////////////////////////////////////////////////////////////////////////
  //                                PRIVATES
  ////////////////////////////////////////////////////////////////////////////

  _isBimobjectOrRoom(nodeType) {
    if (nodeType && spinalGeographicService.constants.GEOGRAPHIC_TYPES_ORDER
      .indexOf(nodeType) !== -1) return true;

    return false;
  },

  async _getBimObjects(nodeInfo) {
    let type = nodeInfo.type.get()
    let nodeId = nodeInfo.id.get();

    if (type === spinalGeographicService.constants
      .EQUIPMENT_TYPE) return [nodeInfo.get()]

    else if (type === spinalGeographicService.constants.ROOM_TYPE) {
      return SpinalGraphService.getChildren(nodeId, [spinalGeographicService
        .constants
        .REFERENCE_RELATION, spinalGeographicService.constants
        .EQUIPMENT_RELATION
      ]).then(children => {
        return children.map(el => el.get());
      });
    } else {
      //   let relations = [
      //     ...spinalGeographicService.constants.GEOGRAPHIC_RELATIONS,
      //     groupService.constants.CONTEXT_TO_CATEGORY_RELATION,
      //     groupService.constants.GROUP_TO_ROOMS_RELATION,
      //     groupService.constants.CATEGORY_TO_GROUP_RELATION,
      //     groupService.constants.GROUP_TO_EQUIPMENTS_RELATION
      //   ]
    }

  },
  _organizeBimObject(bimObjects) {

    let data = [];

    bimObjects.forEach(bim => {
      let found = data.find(el => el.bimFileId === bim.bimFileId);

      if (found) {
        found.selection.push(bim.dbid);
      } else {
        data.push({
          bimFileId: bim.bimFileId,
          selection: [bim.dbid]
        });
      }

    })

    return data;

  }

}