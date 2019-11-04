import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {
  serviceDocumentation
} from 'spinal-env-viewer-plugin-documentation-service';

export default {
  getAllAttributes(nodeId, liste) {
    let realNode = SpinalGraphService.getRealNode(nodeId);

    if (realNode) {
      return serviceDocumentation.getAllAttributes(realNode).then(
        argAttributes => {
          return argAttributes.map(el => {
            let info = el.get();
            if (liste && liste.indexOf(info.label) === -1) liste.push(info
              .label);
            return info;
          })
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

        if (typeof res.data[type] === "undefined") res.data[type] = [];

        info["attributes"] = await this.getAllAttributes(info.id, res
          .attributes);

        res.data[type].push(info);

      })
    }

    return res;
  }
}