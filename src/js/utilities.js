import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import {
  Lst
} from "spinal-core-connectorjs_type";


export default class Utilities {

  static createOrGetContext() {
    this.contextName = ".attributesParams";
    this.CONTEXT_TYPE = "attributesParams";

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

  static getElements(type) {
    return this.createOrGetContext().then(context => {

      if (context) {
        return context.getElement().then(contextElement => {

          if (contextElement[type]) {
            return contextElement[type];
          }

          return new Lst();

        })
      }

      return new Lst();

    })
  }

  static addElement(type, listes) {
    return this.createOrGetContext().then(context => {

      if (context) {
        return context.getElement().then(contextElement => {
          if (contextElement[type]) {
            contextElement[type].clear();

            listes.forEach(element => {
              contextElement[type].push(element);
            });

          } else {
            contextElement.add_attr([type], listes);
          }

          return contextElement[type];

        })
      }

      return [];


    })
  }

}