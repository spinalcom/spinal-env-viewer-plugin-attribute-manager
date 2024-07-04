/*
 * Copyright 2024 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import spinalGeographicService from "spinal-env-viewer-context-geographic-service";

export default {

  async selectitemInViewer(nodeId) {
    const objects = await this.getBimObjectsAndOrganizeThem(nodeId);
    const aggr = this._organizeBimObjectForAggregateViewer(objects, 'ids');
    spinal.ForgeViewer.viewer.setAggregateSelection(aggr);
    spinal.ForgeViewer.viewer.impl.visibilityManager.aggregateIsolate(aggr);
    const aggrFit = this._organizeBimObjectForAggregateViewer(objects, 'selection');
    spinal.ForgeViewer.viewer.fitToView(aggrFit);
  },

  async selectObject(nodeIds) {
    const objects = await this.getBimObjectsAndOrganizeThem(nodeIds);
    const aggr = this._organizeBimObjectForAggregateViewer(objects, 'ids');
    spinal.ForgeViewer.viewer.setAggregateSelection(aggr);
  },

  async IsolateObject(nodeIds) {
    const objects = await this.getBimObjectsAndOrganizeThem(nodeIds);
    const aggr = this._organizeBimObjectForAggregateViewer(objects, 'ids');
    spinal.ForgeViewer.viewer.impl.visibilityManager.aggregateIsolate(aggr);
  },
  async zoomObject(nodeIds) {
    const objects = await this.getBimObjectsAndOrganizeThem(nodeIds);
    const aggr = this._organizeBimObjectForAggregateViewer(objects, 'selection');
    spinal.ForgeViewer.viewer.fitToView(aggr);
  },

  async getBimObjectsAndOrganizeThem(nodeIds) {
    if (!Array.isArray(nodeIds)) nodeIds = [nodeIds];
    const promises = [];


    for (const nodeId of nodeIds) {
      promises.push(this._getBimsOrganized(nodeId));
    }

    let values = await Promise.all(promises);
    const res = [];
    values = values.flat(2);

    for (const obj of values) {
      const found = res.find(el => el.bimFileId === obj.bimFileId);
      if (typeof found === "undefined") {
        res.push(obj);
      } else {
        found.selection.push(...obj.selection);
      }
    }
    return res;
  },

  ////////////////////////////////////////////////////////////////////////////
  //                                PRIVATES
  ////////////////////////////////////////////////////////////////////////////
  _organizeBimObjectForAggregateViewer(bimObjects, name_of_key) {
    const aggregate = bimObjects.reduce((res, el) => {
      let m = window.spinal.BimObjectService
        .mappingBimFileIdModelId[el.bimFileId];
      for (const { model } of m.modelScene) {
        let found = false;
        for (const item of res) {
          if (item.model === model) {
            item[name_of_key].push(...el.selection);
            found = true;
          }
        }
        if (!found) {
          res.push({
            model,
            [name_of_key]: Array.from(el.selection)
          });
        }
      }
      return res;
    }, []);
    return aggregate;
  },

  _isBimobjectOrRoom(nodeType) {
    if (nodeType && spinalGeographicService.constants.GEOGRAPHIC_TYPES_ORDER
      .indexOf(nodeType) !== -1) return true;

    return false;
  },

  async _getBimObjects(nodeInfo) {
    let type = nodeInfo.type.get();
    let nodeId = nodeInfo.id.get();

    if (type === spinalGeographicService.constants
      .EQUIPMENT_TYPE) return [nodeInfo.get()];

    else if (type === spinalGeographicService.constants.ROOM_TYPE) {
      return SpinalGraphService.getChildren(nodeId, [spinalGeographicService
        .constants
        .REFERENCE_RELATION, spinalGeographicService.constants
        .EQUIPMENT_RELATION
      ]).then(children => {
        return children.map(el => el.get());
      });
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
    });
    return data;
  },

  async _getBimsOrganized(nodeId) {
    const nodeInfo = SpinalGraphService.getInfo(nodeId);

    if (nodeInfo && this._isBimobjectOrRoom(nodeInfo.type.get())) {
      const bimObjects = await this._getBimObjects(nodeInfo);
      const objects = this._organizeBimObject(bimObjects);
      return objects;
    }

    return [];
  }

};