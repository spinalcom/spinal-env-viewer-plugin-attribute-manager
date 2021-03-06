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
    const context = await groupManagerService.createGroupContext(
      this.CONTEXT_NAME,
      this.CONFIGURATION_PROFIL_TYPE
    );

    return context;
  }

  async createCategory(categoryName, iconName) {
    const context = await this.createOrGetContext();
    const contextId = context ? context.info.id.get() : undefined;

    return groupManagerService.addCategory(contextId, categoryName, iconName);
  }

  async createGroup(categoryId, groupName, groupColor) {
    const context = await this.createOrGetContext();
    const contextId = context ? context.info.id.get() : undefined;

    return groupManagerService.addGroup(
      contextId,
      categoryId,
      groupName,
      groupColor
    );
  }

  async createConfiguration(
    groupId,
    configurationName,
    configurationCategories = []
  ) {
    const context = await this.createOrGetContext();
    const contextId = context ? context.info.id.get() : undefined;

    const configurationNodeId = SpinalGraphService.createNode({
        name: configurationName,
        type: this.CONFIGURATION_PROFIL_TYPE,
      },
      new Model({
        name: configurationName,
        categories: configurationCategories,
      })
    );

    await groupManagerService.linkElementToGroup(
      contextId,
      groupId,
      configurationNodeId
    );

    return SpinalGraphService.getRealNode(configurationNodeId);
  }

  setAsCurrentConfiguration(nodeId) {
    this.createOrGetContext().then((context) => {
      let realNode = SpinalGraphService.getRealNode(nodeId);

      if (realNode) {
        if (context.info.currentConfiguration) {
          context.info.rem_attr("currentConfiguration");
        }

        context.info.add_attr({
          currentConfiguration: new Ptr(realNode),
        });
      }
    });
  }

  async deleteCurrentConf() {
    const context = await this.createOrGetContext();
    if (context && context.info.currentConfiguration)
      context.info.rem_attr("currentConfiguration");
  }

  getCurrentConfiguration() {
    return this.createOrGetContext().then((context) => {
      let confPtr = context.info.currentConfiguration;

      if (typeof confPtr !== "undefined") {
        return new Promise((resolve) => {
          confPtr.load((realNode) => {
            SpinalGraphService._addNode(realNode);
            return realNode.getElement().then((el) => {
              let element = el.get();
              element["id"] = realNode.info.id.get();
              resolve(element);
            });
          });
        });
      }

      return {
        name: "",
        categories: [],
      };
    });
  }

  editConfiguration(configurationId, configurationElement) {
    let realNode = SpinalGraphService.getRealNode(configurationId);

    if (realNode) {
      realNode.getElement().then((element) => {
        element.set(configurationElement);
      });
    }
  }

  async getConfigurationById(configId) {
    const realNode = SpinalGraphService.getRealNode(configId);

    if (realNode) {
      const elementModel = await realNode.getElement();

      if (elementModel) {
        let element = elementModel.get();
        element["id"] = configId;
        return element;
      }
    }

  }

  async getCategories() {
    const context = await this.createOrGetContext();
    return groupManagerService.getCategories(context.info.id.get());
  }

  getGroups(nodeId) {
    // const context = await this.createOrGetContext();
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
    const obj = {
      categoryId: undefined,
      groupId: undefined,
      configId: undefined
    }

    if (this.isCategory(info.type)) {

      obj.categoryId = info.id;

    } else if (this.isGroup(info.type)) {

      const category = await groupManagerService.getGroupCategory(info.id);
      if (category) obj.categoryId = category.id.get();

      obj.groupId = info.id;

    } else if (info.type === this.CONFIGURATION_PROFIL_TYPE) {

      obj.configId = info.id;
      const group = await this.getElementGroup(info.id);

      if (group) {
        obj.groupId = group.id.get();
        const category = await groupManagerService.getGroupCategory(group.id
          .get());

        if (category) obj.categoryId = category.id.get();

      }

    }

    return obj;

  }

}