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
  <div class="div_container">
    <div class="inputs">
      <md-field md-clearable>
        <label>Attribute name</label>
        <md-input v-model="name"
                  :disabled="advanced"
                  @blur="setValue"></md-input>

        <span v-if="advanced"
              class="md-primary md-helper-text">You use regex
          <a @click="removeRegex">remove it!</a></span>
      </md-field>

      <md-checkbox :disabled="advanced"
                   v-model="contains"
                   class="md-primary">select element includes</md-checkbox>
    </div>

    <div class="buttons">
      <md-button class="md-raised md-primary"
                 @click="openDialog">Use Regex</md-button>
    </div>

  </div>
</template>

<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

export default {
  name: "create-by-attribute",
  props: {
    propsName: {},
    propsContains: {},
    propsRegex: {},
    propsAdvanced: {}
  },
  data() {
    return {
      name: "",
      contains: false,
      regex: "",
      advanced: false
    };
  },
  methods: {
    openDialog() {
      spinalPanelManagerService.openPanel("configureGenerationDialog", {
        callback: regex => {
          this.regex = regex;
          this.advanced = true;
          //   this.contains = false;
          this.name = "";

          this.setValue();
        }
      });
    },

    removeRegex() {
      this.regex = "";
      this.advanced = false;
    },

    getRegex() {
      if (this.advanced) {
        return this.regex;
      } else if (!this.advanced && this.name.trim().length > 0) {
        if (this.contains) {
          return new RegExp(`${RegExp.escape(this.name.trim())}`, "i");
        } else {
          return new RegExp(`^${RegExp.escape(this.name.trim())}$`, "i");
        }
      } else {
        return "";
      }
    },

    setValue() {
      this.$emit("setValue", {
        name: this.name,
        contains: this.contains,
        regex: this.getRegex()
      });
    }
  },
  watch: {
    contains() {
      this.setValue();
    },
    propsName() {
      if (this.propsName !== this.name) this.name = this.propsName;
    },

    propsContains() {
      if (this.propsContains !== this.contains) {
        this.contains = this.propsContains;
      }
    },
    propsRegex() {
      if (this.propsRegex !== this.regex) {
        this.regex = this.propsRegex;
      }
    },
    propsAdvanced() {
      if (this.propsAdvanced !== this.advanced) {
        this.advanced = this.propsAdvanced;
      }
    }
  }
};
</script>

<style scoped>
.div_container {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.div_container .inputs {
  flex: 0 0 70%;
}

.div_container .buttons {
  flex: 0 0 20%;
}
</style>

<style>
.div_container .inputs .md-field {
  /* margin: 0px; */
  /* padding: 0px; */
  min-height: 0px;
}
</style>