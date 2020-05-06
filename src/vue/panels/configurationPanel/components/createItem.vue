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
  <v-popover :auto-hide="false"
             offset="16"
             :open="show && !disabled">

    <md-button class="md-dense md-raised md-primary"
               :disabled="disabled"
               @click.stop="OpenAttribute">
      <md-tooltip>{{title}}</md-tooltip>
      <md-icon>{{icon}}</md-icon>
      {{title}}
    </md-button>

    <template slot="popover">
      <div class="popoverContainer">
        <div class="_popoverContent">

          <md-field class="tooltip-content">
            <label>{{fieldText}}</label>
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
export default {
  name: "createItem",
  props: {
    title: {
      type: String
    },
    fieldText: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
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
        // if (this.category) {
        //   // let varCategory = serviceDocumentation.

        //   this.$emit("add", { category: this.category, label: this.name });
        // } else {
        //   this.$emit("add", { category: this.name });
        // }
        this.$emit("create", this.name.trim());
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