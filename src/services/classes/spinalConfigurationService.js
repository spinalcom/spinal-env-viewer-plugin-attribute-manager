import {
  groupManagerService
} from "spinal-env-viewer-plugin-group-manager-service";


import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

export default class SpinalConfigurationService {

  constructor() {
    this.CONTEXT_NAME = "NomenclatureConfiguration";
    this.CONFIGURATION_PROFIL_TYPE = "AttributeConfiguration";
    this.ATTRIBUTE_TYPE = "configurationAttribute";
  }

  async createOrGetContext() {
    return groupManagerService.createGroupContext(this.CONTEXT_NAME, this.CONFIGURATION_PROFIL_TYPE);
  }

  async createCategory(categoryName, iconName) {
    const context = await this.createOrGetContext();
    const contextId = context ? context.info.id.get() : undefined;

    return groupManagerService.addCategory(contextId, categoryName, iconName);
  }

  async createGroup(categoryId, groupName, groupColor) {
    const context = await this.createOrGetContext();
    const contextId = context ? context.info.id.get() : undefined;

    return groupManagerService.addGroup(contextId, categoryId, groupName, groupColor);
  }

  async createConfiguration(groupId, configurationName, configurationCategories = []) {
    const context = await this.createOrGetContext();
    const contextId = context ? context.info.id.get() : undefined;

    const element = new Model({ name: configurationName, categories: configurationCategories, })
    const configurationNodeId = SpinalGraphService.createNode({ name: configurationName, type: this.CONFIGURATION_PROFIL_TYPE }, element);

    await groupManagerService.linkElementToGroup(contextId, groupId, configurationNodeId);

    return SpinalGraphService.getRealNode(configurationNodeId);
  }

  async setAsCurrentConfiguration(nodeId) {
    const context = await this.createOrGetContext();

    let realNode = SpinalGraphService.getRealNode(nodeId);

    if (!realNode) return;

    if (context.info.currentConfiguration) context.info.rem_attr("currentConfiguration");

    context.info.add_attr({ currentConfiguration: new Ptr(realNode) });
  }

  async deleteCurrentConf() {
    const context = await this.createOrGetContext();
    if (context && context.info.currentConfiguration)
      context.info.rem_attr("currentConfiguration");
  }

  async getCurrentConfiguration() {
    const context = await this.createOrGetContext();
    let confPtr = context.info.currentConfiguration;
    if (!confPtr) return { name: "", categories: [] };

    return new Promise((resolve) => {
      confPtr.load(async (realNode) => {
        SpinalGraphService._addNode(realNode);
        const el = await realNode.getElement();
        let element = el.get();
        element.id = realNode.getId().get();
        resolve(element);
      });
    });
  }

  async editConfiguration(configurationId, configurationElement) {
    let realNode = SpinalGraphService.getRealNode(configurationId);
    if (!realNode) return;

    const element = await realNode.getElement()
    element.set(configurationElement);
  }

  async getConfigurationById(configId) {
    const realNode = SpinalGraphService.getRealNode(configId);
    if (!realNode) return;

    const elementModel = await realNode.getElement();

    if (elementModel) {
      let element = elementModel.get();
      element.id = configId;
      return element;
    }

  }

  async getCategories() {
    const context = await this.createOrGetContext();
    return groupManagerService.getCategories(context.info.id.get());
  }

  getGroups(nodeId) {
    return groupManagerService.getGroups(nodeId);
  }

  getConfigurations(groupId) {
    return groupManagerService.getElementsLinkedToGroup(groupId);
  }


  isGroup(type) {
    return groupManagerService.isGroup(type);
  }

  isCategory(type) {
    return groupManagerService.isCategory(type);
  }

  async getElementGroup(id) {
    const parents = await SpinalGraphService.getParents(id, []);

    return parents[0];
  }

  async getTree(info) {
    if (this.isCategory(info.type)) return this.getTreeUntilCategory(info.id);

    if (this.isGroup(info.type)) return this.getTreeUntilGroup(info.id);

    if (info.type === this.CONFIGURATION_PROFIL_TYPE) return this.getTreeUntilProfile(info.id);

    return {};
  }


  getTreeUntilCategory(id) {
    return { categoryId: id }
  }

  async getTreeUntilGroup(id) {
    const category = await groupManagerService.getGroupCategory(id);

    return { categoryId: category.id.get(), groupId: id }
  }

  async getTreeUntilProfile(id) {
    const group = await this.getElementGroup(id);
    if (!group) return {};

    const obj = await this.getTreeUntilGroup(group.id.get());
    obj.configId = id;

    return obj;
  }


}