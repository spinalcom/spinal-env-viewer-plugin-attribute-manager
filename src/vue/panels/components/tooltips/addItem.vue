<template>
  <v-popover :auto-hide="false"
             offset="16"
             :open="show">

    <!-- <md-button v-if="category"
               class="md-icon-button"
               title="add label"
               @click.stop="OpenAttribute">
      <md-icon>add_circle_outline</md-icon>
    </md-button> -->

    <!-- <md-button v-if="!category"
               class="md-icon-button md-raised md-primary"
               title="add category"
               @click.stop="OpenAttribute">
      <md-icon>add</md-icon>
    </md-button> -->

    <md-button v-if="!category"
               title="add category"
               @click.stop="OpenAttribute"
               class="md-dense md-primary">
      <md-icon>add</md-icon>
      &nbsp;
      Add category
    </md-button>

    <v-btn v-if="category"
           title="add label"
           @click.stop="OpenAttribute"
           flat
           icon
           small
           color="blue">
      <v-icon>add</v-icon>
    </v-btn>

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