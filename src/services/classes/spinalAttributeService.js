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

import {SpinalGraphService} from 'spinal-env-viewer-graph-service';

import {serviceDocumentation} from 'spinal-env-viewer-plugin-documentation-service';

import {BIM_OBJECT_TYPE} from 'spinal-env-viewer-plugin-forge/dist/Constants';

import {bimObjectManagerService} from 'spinal-env-viewer-bim-manager-service';

import {groupManagerService} from 'spinal-env-viewer-plugin-group-manager-service';

// import {
//   groupService
// } from "spinal-env-viewer-room-manager/services/service.js";

export default class SpinalAttributeService {
  constructor() {}

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

      return serviceDocumentation.getCategory(realNode).then((res) => {
        return res
          .map((el) => {
            let attrs = el.element.get();
            return attrs.map((attr) => {
              if (liste && liste.indexOf(attr.label) === -1)
                liste.push(attr.label);
              attr['category'] = el.nameCat;
              return attr;
            });
          })
          .flat();
      });
    } else {
      return Promise.resolve([]);
    }
  }

  async getAllData(contextId, nodeId) {
    let context = SpinalGraphService.getRealNode(contextId);
    let realNode = SpinalGraphService.getRealNode(nodeId);
    let res = {
      types: [],
      attributes: [],
      data: {},
    };

    if (context && realNode) {
      await realNode.findInContext(context, async (node) => {
        SpinalGraphService._addNode(node);
        let type = node.getType().get();
        let info = node.info.get();

        if (res.types.indexOf(type) === -1) {
          res.types.push(type);
        }

        if (typeof res.data[type] === 'undefined') res.data[type] = [];

        info['attributes'] = await this.getAllAttributes(
          info.id,
          res.attributes
        );

        res.data[type].push(info);
      });
    }

    return res;
  }

  getBimObjectAttribute(bimObjectInfo, attributeName) {
    let value = attributeName.toLowerCase();

    let model =
      window.spinal.BimObjectService.getModelByBimfile(
        bimObjectInfo.bimFileId
      ) || window.NOP_VIEWER.model;

    const dbId = bimObjectInfo.dbid || bimObjectInfo.dbId;

    if (model) {
      return bimObjectManagerService
        .getBimObjectProperties({
          model: model,
          selection: [dbId],
        })
        .then((res) => {
          let properties = res[0].properties[0].properties;

          let found = properties.find((el) => {
            let attrName = el.attributeName.toLowerCase();
            let displayName = el.displayName.toLowerCase();

            return attrName === value || displayName === value;
          });

          if (found) {
            return found.displayValue;
          } else {
            return '-';
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return '-';
    }
  }

  async createAttribute(nodeId, categoryName, attributeName) {
    let realNode = SpinalGraphService.getRealNode(nodeId);

    let category;

    category = await serviceDocumentation.getCategoryByName(
      realNode,
      categoryName
    );

    if (typeof category === 'undefined') {
      category = await serviceDocumentation.addCategoryAttribute(
        realNode,
        categoryName
      );
    }

    let attr = {
      label: attributeName,
      value: '-',
    };
    if (realNode.getType().get() === BIM_OBJECT_TYPE) {
      attr.value = await this.getBimObjectAttribute(
        realNode.info.get(),
        attributeName
      );
    }

    await serviceDocumentation.addAttributeByCategory(
      realNode,
      category,
      attr.label,
      attr.value
    );
  }

  async updateAttributeValue(
    nodeId,
    categoryName,
    attributeName,
    attributeValue
  ) {
    let attr = await this.getOrCreateAttribute(
      nodeId,
      categoryName,
      attributeName
    );

    if (attr && attr.value) {
      attr.value.set(attributeValue);
    }
  }

  getBimObjects(nodeId) {
    // console.log(SpinalGraphService.getInfo(nodeId));
    // return SpinalGraphService.findNodes(nodeId,)
  }

  async getOrCreateAttribute(nodeId, categoryName, attributeName) {
    let realNode = SpinalGraphService.getRealNode(nodeId);
    if (realNode) {
      let category = await serviceDocumentation.getCategoryByName(
        realNode,
        categoryName
      );

      if (typeof category === 'undefined') {
        category = await serviceDocumentation.addCategoryAttribute(
          realNode,
          categoryName
        );
      }

      let attributes = await serviceDocumentation.getAttributesByCategory(
        realNode,
        categoryName
      );

      let attr = attributes.find((el) => {
        return el.label.get() === attributeName;
      });

      if (attr) return attr;

      await serviceDocumentation.addAttributeByCategory(
        realNode,
        category,
        attributeName,
        '-'
      );

      attributes = await serviceDocumentation.getAttributesByCategory(
        realNode,
        categoryName
      );

      return attributes.find((el) => {
        return el.label.get() === attributeName;
      });
    }
  }

  getAllGroupContext(type) {
    // return Promise.all([SpinalGraphService.getContextWithType(
    //     groupService.constants.ROOMS_GROUP_CONTEXT),
    //   SpinalGraphService.getContextWithType(
    //     groupService.constants.EQUIPMENTS_GROUP_CONTEXT),
    //   SpinalGraphService.getContextWithType(
    //     groupService.constants.ENDPOINTS_GROUP_CONTEXT)
    // ]).then(values => {
    //   let contexts = values.flat();

    //   let promises = contexts.map(async context => {
    //     let res = context.info.get();
    //     res["category"] = await this.getCategory(res.id, res
    //       .type);
    //     return res;
    //   })

    //   return Promise.all(promises);

    // })

    // console.log("service type", type);

    return groupManagerService.getGroupContexts(type).then((contexts) => {
      const promises = contexts.map(async (context) => {
        context['category'] = await this.getCategory(context.id);
        return context;
      });

      return Promise.all(promises);
    });
  }

  async getCategory(contextId) {
    // let relationName = groupService.constants
    //   .CONTEXT_TO_CATEGORY_RELATION;

    // return SpinalGraphService.getChildren(contextId, [relationName]).then(
    //   children => {
    //     let promises = children.map(async child => {
    //       let info = child.get();
    //       info["groups"] = await this.getGroup(child.id, child
    //         .type);
    //       return info;
    //     })

    //     return Promise.all(promises);

    //   })

    const categories = await groupManagerService.getCategories(contextId);

    const promises = categories.map(async (category) => {
      let info = category.get();
      info['groups'] = await this.getGroup(category.id);
      return info;
    });

    return Promise.all(promises);
  }

  async getGroup(categoryId) {
    // let relationName = groupService.constants.CATEGORY_TO_GROUP_RELATION;

    // return SpinalGraphService.getChildren(categoryId, [relationName])
    //   .then(
    //     children => {
    //       return children.map(el => el.get());
    //     })

    const groups = await groupManagerService.getGroups(categoryId);

    return groups.map((el) => el.get());
  }

  linkItem(contextId, parentId, itemId) {
    // groupService.linkElementToGroup(parentId, itemId, contextId)
    return groupManagerService.linkElementToGroup(contextId, parentId, itemId);
  }
}
