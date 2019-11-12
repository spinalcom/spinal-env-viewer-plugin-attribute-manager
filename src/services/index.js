import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {
  serviceDocumentation
} from 'spinal-env-viewer-plugin-documentation-service';

import {
  BIM_OBJECT_TYPE
} from "spinal-env-viewer-plugin-forge/dist/Constants";

import {
  bimObjectManagerService
} from "spinal-env-viewer-bim-manager-service";

export default {
  getAllAttributes(nodeId, liste) {
    let realNode = SpinalGraphService.getRealNode(nodeId);

    if (realNode) {
      // return serviceDocumentation.getAllAttributes(realNode).then(
      //   argAttributes => {
      //     return argAttributes.map(el => {
      //       let info = el.get();
      //       if (liste && liste.indexOf(info.label) === -1) liste.push(info
      //         .label);
      //       return info;
      //     })
      //   });

      return serviceDocumentation.getCategory(realNode).then(res => {
        return res.map(el => {
          let attrs = el.element.get();
          return attrs.map(attr => {
            if (liste && liste.indexOf(attr.label) === -1) liste
              .push(attr.label);
            attr["category"] = el.nameCat;
            return attr;
          })
        }).flat();
      });

    } else {
      return Promise.resolve([]);
    }
  },
  async getAllData(contextId, nodeId) {
    let context = SpinalGraphService.getRealNode(contextId);
    let realNode = SpinalGraphService.getRealNode(nodeId);
    let res = {
      types: [],
      attributes: [],
      data: {}
    };

    if (context && realNode) {
      await realNode.findInContext(context, async (node) => {
        let type = node.getType().get();
        let info = node.info.get();

        if (res.types.indexOf(type) === -1) {
          res.types.push(type);
        }

        if (typeof res.data[type] === "undefined") res.data[
          type] = [];

        info["attributes"] = await this.getAllAttributes(info.id, res
          .attributes);

        res.data[type].push(info);

      })
    }

    return res;
  },
  getBimObjectAttribute(bimObjectInfo, attributeName) {

    // let modelScenes = window.spinal.BimObjectService.mappingBimFileIdModelId[
    //   bimObjectInfo.bimFileId
    // ].modelScene;

    // let properties = modelScenes.map(scene => {
    //   let model = scene.model;
    //   return bimObjectManagerService.getBimObjectsByPropertiesName(
    //     model, {
    //       name: attributeName
    //     }
    //   )
    // })

    // return Promise.all(properties).then(val => val.flat());

    let model = window.spinal.BimObjectService.getModelByBimfile(bimObjectInfo
      .bimFileId);

    let value = attributeName.toLowerCase();


    if (model) {
      return bimObjectManagerService.getBimObjectProperties({
        model: model,
        selection: [bimObjectInfo.dbid]
      }).then(res => {
        let properties = res[0].properties[0].properties;

        let found = properties.find(el => {
          let attrName = el.attributeName.toLowerCase();
          let displayName = el.displayName.toLowerCase();

          return attrName === value || displayName === value;
        })

        if (found) {
          return found.displayValue;
        } else {
          return "-";
        }

      }).catch(err => {
        console.error(err);
      })
    } else {
      return "-";
    }

  },
  async createAttribute(nodeId, categoryName, attributeName) {
    let realNode = SpinalGraphService.getRealNode(nodeId);

    let category;

    category = await serviceDocumentation.getCategoryByName(realNode,
      categoryName);

    if (typeof category === "undefined") {
      category = await serviceDocumentation.addCategoryAttribute(realNode,
        categoryName);
    }


    let attr = {
      label: attributeName,
      value: "-"
    }
    if (realNode.getType().get() === BIM_OBJECT_TYPE) {
      attr.value = await this.getBimObjectAttribute(realNode.info.get(),
        attributeName);
    }

    await serviceDocumentation.addAttributeByCategory(realNode, category,
      attr
      .label, attr.value);

  },
  async updateAttributeValue(nodeId, categoryName, attributeName,
    attributeValue) {
    let realNode = SpinalGraphService.getRealNode(nodeId);

    if (realNode) {
      let attributes = await serviceDocumentation.getAttributesByCategory(
        realNode,
        categoryName);

      let attr = attributes.find(el => {
        return el.label.get() === attributeName;
      })

      if (attr && attr.value) {
        attr.value.set(attributeValue);
      }

    }
  }
}