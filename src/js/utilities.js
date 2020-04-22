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

import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";

import {
  Model,
  Ptr
} from "spinal-core-connectorjs_type";


export default class Utilities {

  static createOrGetContext() {
    this.contextName = "Nomenclature_Configuration";
    this.CONTEXT_TYPE = "Nomenclature_Configuration";
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

  static getAllConfiguration() {
    return this.createOrGetContext().then(context => {
      let contextId = context.info.id.get();

      return SpinalGraphService.getChildren(contextId, [this
        .CONTEXT_TO_CONFIGURATION_RELATION
      ]).then(configurations => {
        let promises = configurations.map(async configuration => {
          let id = configuration.id.get();
          let realNode = SpinalGraphService.getRealNode(id);
          let elementModel = await realNode.getElement();

          if (elementModel) {
            let element = elementModel.get();
            element["id"] = id;
            return element;
          }

        })

        return Promise.all(promises);

      })

    })
  }

  static getElements() {
    return this.getCurrentConfiguration().then(res => {
      return res.categories;
    })
  }

  static setAsCurrentConfiguration(nodeId) {
    this.createOrGetContext().then(context => {
      let realNode = SpinalGraphService.getRealNode(nodeId);

      if (realNode) {
        if (context.info.currentConfiguration) {

          // context.info.currentConfiguration.load((res) => {
          //   res.set(realNode)
          // });

          context.info.rem_attr("currentConfiguration");

        }

        context.info.add_attr({
          currentConfiguration: new Ptr(realNode)
        })

      }
    })
  }

  static getCurrentConfiguration() {
    return this.createOrGetContext().then(context => {
      //   let id = context.info.currentConfiguration;

      //   if (typeof id === "undefined") {
      //     return
      //   }

      //   let realNode = SpinalGraphService.getRealNode(id.get());

      //   return realNode.getElement().then(el => {
      //     let element = el.get();
      //     element["id"] = id.get();

      //     return element;
      //   })

      // })


      let confPtr = context.info.currentConfiguration;

      if (typeof confPtr !== "undefined") {
        return new Promise(resolve => {
          confPtr.load((realNode) => {
            return realNode.getElement().then(el => {
              let element = el.get();
              element["id"] = realNode.info.id.get();
              resolve(element);
            })
          })
        })
      }

      return {
        name: "",
        categories: []
      }

    })
  }


  static editConfiguration(configurationId, configurationElement) {
    let realNode = SpinalGraphService.getRealNode(configurationId);

    if (realNode) {
      realNode.getElement().then(element => {
        element.set(configurationElement);
      })
    }

  }

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