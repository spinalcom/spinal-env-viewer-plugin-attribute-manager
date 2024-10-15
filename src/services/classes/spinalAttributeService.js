/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
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

import { SpinalGraphService, SpinalNode } from 'spinal-env-viewer-graph-service';

import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';

import { BIM_OBJECT_TYPE } from 'spinal-env-viewer-plugin-forge/dist/Constants';

import { bimObjectManagerService } from 'spinal-env-viewer-bim-manager-service';

import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service';

// import {
//   groupService
// } from "spinal-env-viewer-room-manager/services/service.js";

export default class SpinalAttributeService {
  constructor() { }

  async getAllAttributes(nodeId, liste) {
    let realNode = SpinalGraphService.getRealNode(nodeId);

    if (!realNode) return Promise.resolve([]);

    const categories = await serviceDocumentation.getCategory(realNode);

    return categories.reduce((l, el) => {
      let attrs = el.element.get();

      for (const attr of attrs) {
        if (liste && !liste.includes(attr.label)) liste.push(attr.label);
        attr.category = el.nameCat;
        l.push(attr);
      }

      return l;
    }, [])


  }

  // get All Nodes and their attributes
  async getAllData(contextId, nodeId) {
    let context = SpinalGraphService.getRealNode(contextId);
    let realNode = SpinalGraphService.getRealNode(nodeId);

    let res = {
      types: [],
      attributes: [],
      data: {},
    };

    if (!context || !realNode) return res;


    await realNode.findInContext(context, async (node) => {
      SpinalGraphService._addNode(node);
      const type = node.getType().get();

      if (!res.types.includes(type)) res.types.push(type);

      if (!res.data[type]) res.data[type] = [];

      let info = node.info.get();

      info.attributes = await this.getAllAttributes(info.id, res.attributes);

      res.data[type].push(info);
    });


    return res;
  }

  getBimObjectAttribute(bimObjectInfo, attributeName) {
    try {
      let value = attributeName.toLowerCase();

      const modelByBimFile = window.spinal.BimObjectService.getModelByBimfile(bimObjectInfo.bimFileId)

      let model = modelByBimFile || window.NOP_VIEWER.model;

      if (!model) return '-';

      const dbId = bimObjectInfo.dbid || bimObjectInfo.dbId;

      let properties = this.getBimObjectProperties(model, [dbId]);

      let found = properties.find(({ attributeName, displayName }) => [attributeName.toLowerCase(), displayName.toLowerCase()].includes(value.toLowerCase()));

      if (found) return found.displayValue;

      return '-';
    } catch (error) {
      console.error(error);
      return "-";
    }

  }

  async createAttribute(nodeId, categoryName, attributeName, attributeValue) {
    let realNode = SpinalGraphService.getRealNode(nodeId);
    let category = await this.getOrCreateCategory(realNode, categoryName);

    const value = attributeValue?.toString().length > 0 ? attributeValue : "-";
    let attr = { label: attributeName, value };

    if (realNode.getType().get() === BIM_OBJECT_TYPE && value === "-") {
      attr.value = await this.getBimObjectAttribute(realNode.info.get(), attributeName);
    }

    await serviceDocumentation.addAttributeByCategory(realNode, category, attr.label, attr.value);
  }


  async updateSeveralAttributes(nodeId, categoryName, attributes) {
    const realNode = SpinalGraphService.getRealNode(nodeId);
    if (!realNode) return;

    const category = await this.getOrCreateCategory(realNode, categoryName);
    const attributesList = await serviceDocumentation.getAttributesByCategory(realNode, category);

    const obj = this._convertLstToObj(attributesList);

    for (const attr of attributes) {
      if (obj[attr.label]) obj[attr.label].value.set(attr.value);
      else await this.updateAttributeValue(nodeId, category, attr.label, attr.value);
    }

  }

  async updateAttributeValue(nodeId, categoryName, attributeName, attributeValue) {
    let attr = await this.getOrCreateAttribute(nodeId, categoryName, attributeName, attributeValue);

    if (attr && typeof attr.value != "undefined") attr.value.set(attributeValue);
  }

  getBimObjects(nodeId) {
    // console.log(SpinalGraphService.getInfo(nodeId));
    // return SpinalGraphService.findNodes(nodeId,)
  }

  async getOrCreateAttribute(nodeId, categoryName, attributeName, attributeValue) {
    let realNode = SpinalGraphService.getRealNode(nodeId);
    if (!realNode) return;

    let category = await this.getOrCreateCategory(realNode, categoryName);
    let attr = await this.findAttributeInCategory(realNode, category, attributeName);

    if (attr) return attr;


    return this.createAttribute(nodeId, category, attributeName, attributeValue);
  }


  async findAttributeInCategory(realNode, category, attributeName) {
    const attributes = await serviceDocumentation.getAttributesByCategory(realNode, category);

    for (let i = 0; i < attributes.length; i++) {
      const el = attributes[i];
      if (el.label.get() === attributeName) return el;
    }
  }



  async getAllGroupContext(type) {
    const contexts = await groupManagerService.getGroupContexts(type)
    const promises = contexts.map(async (context) => {
      context.category = await this.getCategory(context.id);
      return context;
    });

    return Promise.all(promises);
  }

  async getCategory(contextId) {
    const categories = await groupManagerService.getCategories(contextId);

    const promises = categories.map(async (category) => {
      let info = category.get();
      info.groups = await this.getGroup(category.id);
      return info;
    });

    return Promise.all(promises);
  }

  async getGroup(categoryId) {
    const groups = await groupManagerService.getGroups(categoryId);

    return groups.map((el) => el.get());
  }

  linkItem(contextId, parentId, itemId) {
    return groupManagerService.linkElementToGroup(contextId, parentId, itemId);
  }

  async getOrCreateCategory(realNode, categoryName) {
    if (typeof categoryName === "object") return categoryName;

    realNode = realNode instanceof SpinalNode ? realNode : SpinalGraphService.getRealNode(realNode);
    let category = await serviceDocumentation.getCategoryByName(realNode, categoryName);

    if (!category) category = await serviceDocumentation.addCategoryAttribute(realNode, categoryName);

    return category;
  }

  async getBimObjectProperties(model, dbIds) {
    const res = await bimObjectManagerService.getBimObjectProperties({ model: model, selection: dbIds });
    return res[0].properties[0].properties;
  }

  _convertLstToObj(lst) {
    const obj = {};
    for (let i = 0; i < lst.length; i++) {
      let el = lst[i];
      obj[el.label.get()] = el;
    }

    return obj;
  }
}
