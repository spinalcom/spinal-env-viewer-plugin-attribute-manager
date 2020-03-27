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
  <div v-if="data"
       class="content"
       :class="{'contentEditable' : editable}"
       :contenteditable="editable"
       ref="display"
       @input="changeValue">
    {{data.displayValue}}
  </div>
</template>

<script>
import attributeService from "../../../../services";

export default {
  name: "tableContentComponent",
  props: ["editable", "item", "attribute"],
  data() {
    return {
      // value: "",
      // displayValue: ""
      data: undefined
    };
  },
  mounted() {
    // this.value = this.getValue();
    // this.displayValue = this.value;

    this.data = this.getValue();
  },
  methods: {
    getValue() {
      let found;
      if (this.item && this.attribute) {
        found = this.item.attributes.find(el => {
          return (
            el.label === this.attribute.label &&
            el.category === this.attribute.category
          );
        });
      }
      if (found) {
        found["displayValue"] = found.value;
        return found;
      }
      return {
        value: "-",
        displayValue: "-"
      };
    },

    setValue() {
      this.$emit("setValue", {
        item: this.item,
        attribute: this.attribute,
        value: this.data.displayValue
      });
    },

    cancelValue() {
      this.data.displayValue = this.data.value;
      this.$refs.display.innerText = this.data.displayValue;
    },

    changeValue() {
      // this.displayValue = event.target.innerText;
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
    }
  },
  destroyed() {
    console.log("destroyed");
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  word-break: break-word;
}

.contentEditable {
  border-bottom: 1px solid gray;
}
</style>