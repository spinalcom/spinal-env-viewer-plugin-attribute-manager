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
  <v-popover :auto-hide="false" offset="16" :open="show">

    <v-btn outline color="#448aff" v-if="!category" title="add category" @click.stop="OpenAttribute">Add
      category</v-btn>

    <v-btn v-if="category" title="add label" @click.stop="OpenAttribute" flat icon small color="blue">
      <v-icon>add</v-icon>
    </v-btn>

    <template slot="popover">
      <div class="popoverContainer">
        <div class="_popoverContent">

          <md-field class="tooltip-content">
            <label>{{ category ? "Add attribute" : "Add category" }}</label>
            <md-input v-model="name"></md-input>
          </md-field>

        </div>

        <div class="_popoverBtn">
          <a class="btn" @click="Validate(false)">Close</a>

          <a class="btn" @click="Validate(true)">OK</a>
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