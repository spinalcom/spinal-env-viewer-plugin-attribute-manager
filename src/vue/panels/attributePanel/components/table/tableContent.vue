<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
   <div
      class="content"
      v-if="data"
      @mouseover="mouseIsOver"
      @mouseleave="mouseOutOver"
   >

      <div
         class="valueDiv"
         :class="{'contentEditable' : editable}"
         :contenteditable="editable"
         ref="display"
         @input="changeValue"
      >
         {{data.displayValue}}
      </div>

      <md-button
         class="contentIcon md-icon-button md-dense"
         v-if="displayBtn()"
         @click="findValueInMaquette"
      >
         <md-tooltip>find value in maquette</md-tooltip>
         <md-icon>my_location</md-icon>
      </md-button>

      <!-- <md-icon class="contentIcon"
             v-if="displayBtn()"
             @click="findValueInMaquette">my_location</md-icon> -->

   </div>
</template>

<script>
import attributeService from "../../../../../services";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
const lodash = require("lodash");

export default {
   name: "tableContentComponent",
   props: ["editable", "item", "attribute", "itemsMap"],
   data() {
      return {
         // value: "",
         // displayValue: ""
         data: undefined,
         mouseOver: false,
      };
   },
   mounted() {
      // this.value = this.getValue();
      // this.displayValue = this.value;

      this.data = this.getValue();
   },
   methods: {
      getValue() {
         let value = this.itemsMap.get(this.item.id);
         return value[`${this.attribute.category}_${this.attribute.label}`];
         // let found;
         // if (this.item && this.attribute) {
         //   found = this.item.attributes.find(el => {
         //     return (
         //       el.label === this.attribute.label &&
         //       el.category === this.attribute.category
         //     );
         //   });
         // }
         // if (found) {
         //   found["displayValue"] = found.value;
         //   return found;
         // }
         // return {
         //   value: "-",
         //   displayValue: "-"
         // };
      },

      setValue() {
         this.$emit("setValue", {
            item: this.item,
            attribute: this.attribute,
            value: this.data.displayValue,
         });
      },

      cancelValue() {
         this.data.displayValue = this.data.value;
         this.$refs.display.innerText = this.data.displayValue;
         this.itemsMap.get(this.item.id)[
            `${this.attribute.category}_${this.attribute.label}`
         ]["displayValue"] = this.itemsMap.get(this.item.id)[
            `${this.attribute.category}_${this.attribute.label}`
         ]["value"];
      },

      changeValue(event) {
         const el = event.target;

         this.itemsMap.get(this.item.id)[
            `${this.attribute.category}_${this.attribute.label}`
         ]["displayValue"] = this.$refs.display.innerText;
         this.displayValue = el.innerText;

         this.setCursorAtEnd(el);
      },

      setValueToColumn(category, label, value) {
         if (
            value.length > 0 &&
            this.attribute.category === category &&
            this.attribute.label === label
         ) {
            this.data.displayValue = value;
            this.$refs.display.innerText = value;
         }
      },

      validateValue() {
         this.data.displayValue = this.$refs.display.innerText;

         if (this.data.displayValue !== this.data.value) {
            attributeService
               .updateAttributeValue(
                  this.item.id,
                  this.attribute.category,
                  this.attribute.label,
                  this.data.displayValue
               )
               .then(() => {
                  this.data.value = this.data.displayValue;
                  this.setValue();
               });
         }
      },

      mouseIsOver() {
         this.mouseOver = true;
      },

      displayBtn() {
         let nodeInfo = SpinalGraphService.getInfo(this.item.id);

         const isBimObject = nodeInfo && nodeInfo.type.get() === "BIMObject";

         return this.editable && this.mouseOver && isBimObject;
      },

      mouseOutOver() {
         this.mouseOver = false;
      },

      findValueInMaquette() {
         this.$emit("findValueInMaquette", {
            id: this.item.id,
            category: this.attribute.category,
            attribute: this.attribute.label,
         });
      },

      setCursorAtEnd(el) {
         el.focus();
         if (
            typeof window.getSelection != "undefined" &&
            typeof document.createRange != "undefined"
         ) {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
         } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
         }
      },
   },
};
</script>

<style scoped>
.content {
   width: 100%;
   word-break: break-word;
   display: flex;
}

.content .valueDiv {
   width: 80%;
}

.content .contentEditable {
   /* width: 80%; */
   padding-bottom: 6px;
   border-bottom: 1px solid gray;
}

.content .contentIcon {
   /* width: 20%;
  min-width: 10px;
  width: 10px;
  height: 10px; */
   /* z-index: 999999; */

   width: 24px;
   min-width: 24px;
   padding: 0px;
   margin: 0px;
   height: 24px;
}

.content .contentIcon:hover {
   cursor: pointer;
   color: #448aff;
}
</style>

<style>
.content .contentIcon .md-ripple {
   padding: 0px;
}
</style>