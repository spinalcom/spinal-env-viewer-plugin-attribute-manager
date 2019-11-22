<template>
  <div class="content"
       :class="{'contentEditable' : editable}"
       :contenteditable="editable"
       ref="display"
       @input="changeValue">
    {{displayValue}}
  </div>
</template>

<script>
import attributeService from "../../../../services";

export default {
  name: "tableContentComponent",
  props: ["editable", "item", "attribute"],
  data() {
    return {
      value: "",
      displayValue: ""
    };
  },
  mounted() {
    this.value = this.getValue();
    this.displayValue = this.value;
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
      return typeof found !== "undefined" ? found.value : "-";
    },

    setValue() {
      this.$emit("setValue", {
        item: this.item,
        attribute: this.attribute,
        value: this.displayValue
      });
    },

    cancelValue() {
      this.displayValue = this.value;
      this.$refs.display.innerText = this.displayValue;
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
        this.displayValue = value;
        this.$refs.display.innerText = value;
      }
    },

    validateValue() {
      this.displayValue = this.$refs.display.innerText;
      attributeService
        .updateAttributeValue(
          this.item.id,
          this.attribute.category,
          this.attribute.label,
          this.displayValue
        )
        .then(() => {
          this.value = this.displayValue;
          this.setValue();
        });
    }
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