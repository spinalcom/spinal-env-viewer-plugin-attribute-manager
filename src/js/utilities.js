import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";
import {
  Model
} from "spinal-core-connectorjs_type";


export default class Utilities {

  static createOrGetContext() {
    this.contextName = "configurationContext";
    this.CONTEXT_TYPE = "configurationContext";
    this.CATEGORY_TYPE = "configurationCategory";
    this.ATTRIBUTE_TYPE = "configurationAttribute";


    this.CONTEXT_TO_CONFIGURATION_RELATION = "hasConfiguration";
    this.CONFIGURATION_TO_CATEGORY_RELATION = "hasCategory";
    this.CATEGORY_TO_ATTRIBUTE_RELATION = "hasAttribute";

    let context = SpinalGraphService.getContext(this.contextName);

    if (typeof context !== "undefined") return Promise.resolve(context);

    return SpinalGraphService.addContext(
      this.contextName,
      this.CONTEXT_TYPE,
      new Model({
        name: this.contextName
      })
    );

  }

  static createConfiguration(configurationName, configurationCategories) {
    return this.createOrGetContext().then(context => {
      let contextId = context.info.id.get();

      let configurationNode = SpinalGraphService.createNode({
        name: configurationName,
        type: this.CATEGORY_TYPE
      }, new Model({
        name: configurationName,
        categories: configurationCategories
      }))

      if (configurationNode) {
        return SpinalGraphService.addChildInContext(contextId,
          configurationNode,
          contextId, this.CONTEXT_TO_CONFIGURATION_RELATION,
          SPINAL_RELATION_PTR_LST_TYPE);
      }

    })
  }

  // static getElements(type) {
  //   return this.createOrGetContext().then(context => {

  //     if (context) {
  //       return context.getElement().then(contextElement => {

  //         if (contextElement[type]) {
  //           return contextElement[type];
  //         }

  //         return new Lst();

  //       })
  //     }

  //     return new Lst();

  //   })
  // }

  // static addElement(type, listes) {
  //   return this.createOrGetContext().then(context => {

  //     if (context) {
  //       return context.getElement().then(contextElement => {
  //         if (contextElement[type]) {
  //           contextElement[type].clear();

  //           listes.forEach(element => {
  //             contextElement[type].push(element);
  //           });

  //         } else {
  //           contextElement.add_attr([type], listes);
  //         }

  //         return contextElement[type];

  //       })
  //     }

  //     return [];


  //   })
  // }

}