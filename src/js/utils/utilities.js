/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
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

import { SpinalGraphService, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";

import { Model, Ptr } from "spinal-core-connectorjs_type";


class Utilities {

  CONTEXT_NAME = "Nomenclature_Configuration";
  CONTEXT_TYPE = "Nomenclature_Configuration";
  CATEGORY_TYPE = "configurationCategory";
  ATTRIBUTE_TYPE = "configurationAttribute";

  CONTEXT_TO_CONFIGURATION_RELATION = "hasConfiguration";
  CONFIGURATION_TO_CATEGORY_RELATION = "hasCategory";
  CATEGORY_TO_ATTRIBUTE_RELATION = "hasAttribute";

  static _instance = null;

  constructor() { }

  static getInstance() {
    if (this._instance === null) {
      this._instance = new Utilities();
    }

    return this._instance;
  }

  async createOrGetContext() {
    let context = SpinalGraphService.getContext(this.CONTEXT_NAME);

    if (context) return context;

    return SpinalGraphService.addContext(this.CONTEXT_NAME, this.CONTEXT_TYPE, new Model({ name: this.contextName }));
  }

  async createConfiguration(configurationName, configurationCategories) {
    const context = await this.createOrGetContext();
    let contextId = context.getId().get();

    const element = new Model({ name: configurationName, categories: configurationCategories })
    let configurationNodeId = SpinalGraphService.createNode({ name: configurationName, type: this.CATEGORY_TYPE }, element);

    return SpinalGraphService.addChildInContext(contextId, configurationNodeId, contextId, this.CONTEXT_TO_CONFIGURATION_RELATION, SPINAL_RELATION_PTR_LST_TYPE);
  }


  async getAllConfiguration() {
    const context = await this.createOrGetContext();

    let contextId = context.getId().get();
    const configurations = await SpinalGraphService.getChildren(contextId, [this.CONTEXT_TO_CONFIGURATION_RELATION]);

    let promises = configurations.map(async configuration => {
      let realNode = SpinalGraphService.getRealNode(configuration.id.get());
      let elementModel = await realNode.getElement();

      if (elementModel) {
        let element = elementModel.get();
        element.id = id;
        return element;
      }

    })

    return Promise.all(promises);
  }

  async getElements() {
    const res = await this.getCurrentConfiguration();
    return res.categories;
  }

  async setAsCurrentConfiguration(nodeId) {
    const context = await this.createOrGetContext();
    let realNode = SpinalGraphService.getRealNode(nodeId);

    if (!realNode) return;

    if (context.info.currentConfiguration) context.info.rem_attr("currentConfiguration");
    context.info.add_attr({ currentConfiguration: new Ptr(realNode) });

  }

  async getCurrentConfiguration() {
    const context = await this.createOrGetContext();

    let confPtr = context.info.currentConfiguration;

    if (!confPtr) return { name: "", categories: [] };

    return new Promise(resolve => {
      confPtr.load(async (realNode) => {
        const el = await realNode.getElement();
        let element = el.get();
        element.id = realNode.getId().get();
        resolve(element);
      })
    })
  }


  async editConfiguration(configurationId, configurationElement) {
    let realNode = SpinalGraphService.getRealNode(configurationId);

    if (realNode) {
      const element = await realNode.getElement
      element.set(configurationElement);
    }

  }

}

export default Utilities.getInstance();