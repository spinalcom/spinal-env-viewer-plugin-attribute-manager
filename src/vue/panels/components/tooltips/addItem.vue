<template>
  <v-popover :auto-hide="false"
             offset="16"
             :open="show">

    <md-button class="md-icon-button"
               title="add label"
               @click.stop="OpenAttribute">
      <md-icon>add_circle_outline</md-icon>
    </md-button>

    <template slot="popover">
      <div class="popoverContainer">
        <div class="_popoverContent">

          <md-field class="tooltip-content">
            <label>{{category ? "Add attribute" : "Add category"}}</label>
            <md-input v-model="name"></md-input>
          </md-field>

        </div>

        <div class="_popoverBtn">
          <a class="btn"
             @click="Validate(false)">Close</a>

          <a class="btn"
             @click="Validate(true)">OK</a>
        </div>
      </div>

    </template>

  </v-popover>
</template>

<script>
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";

export default {
  name: "CreateLabel",
  props: ["category"],
  data() {
    return {
      name: "",
      show: false
    };
  },
  methods: {
    Validate(isValid) {
      this.show = false;
      if (isValid && this.name.trim().length > 0) {
        if (this.category) {
          // let varCategory = serviceDocumentation.

          this.$emit("add", { category: this.category, label: this.name });
        } else {
          this.$emit("add", { category: this.name });
        }
      }

      this.name = "";
    },
    OpenAttribute() {
      this.show = !this.show;
    }
  }
};
</script>

<style scoped>
.popoverContainer ._popoverBtn {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.popoverContainer ._popoverBtn .btn {
  font-size: 15px;
  margin-right: 10px;
  cursor: pointer;
}
</style>