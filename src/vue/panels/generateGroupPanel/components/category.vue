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
  <div class="sub-content">
    <md-subheader>Category</md-subheader>

    <div class="contentDiv">

      <div class="radiosDiv">

        <md-subheader>Create By using : </md-subheader>

        <md-radio v-model="data.category.createBy"
                  :value="CREATE_DATA.attribute"
                  class="md-primary">Attribute</md-radio>

        <md-radio v-model="data.category.createBy"
                  :value="CREATE_DATA.name"
                  class="md-primary">Name</md-radio>

        <md-radio v-model="data.category.createBy"
                  :value="CREATE_DATA.fixed"
                  class="md-primary">Fixed value</md-radio>

      </div>

      <div class="content">

        <create-by-attribute v-if="data.category.createBy === CREATE_DATA.attribute"
                             :propsName="data.category.name"
                             :propsContains="data.category.contains"
                             :propsRegex="data.category.regex"
                             :propsAdvanced="data.category.advanced"
                             @setValue="setAttributeValue">
        </create-by-attribute>

        <create-by-name v-else-if="data.category.createBy === CREATE_DATA.name"
                        :propsSeparator="data.category.separator"
                        :propsPosition="data.category.position"
                        @setValue="setNameValue">
        </create-by-name>

        <create-by-fixed-value v-else-if="data.category.createBy === CREATE_DATA.fixed"
                               @setValue="setFixedValue"
                               :propsName="data.category.fixedValue">
        </create-by-fixed-value>

        <!-- <md-field class="fixedInput inputDiv"
                  v-if="data.category.fixed">
          <label>Category Name</label>
          <md-input :disabled="!data.category.fixed"
                    v-model="data.category.name"></md-input>
        </md-field> -->

        <!-- <div class="dynamicDiv">
          <md-field class="inputDiv">
            <label>regex</label>
            <md-input v-model="data.category.regex"
                      disabled></md-input>

          </md-field>

          <md-button class="md-raised md-primary md-suffix"
                     @click="openDialog">
            <md-tooltip>Create dynamically</md-tooltip>
            Edit
          </md-button>

        </div> -->

      </div>

    </div>

  </div>
</template>

<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import create_data from "../js/data.js";
import CreateByAttribute from "./createByAttribute.vue";
import CreateByName from "./createByName.vue";
import CreateByFixedValue from "./createByFixedValue.vue";

export default {
  name: "categoryVue",
  components: {
    "create-by-attribute": CreateByAttribute,
    "create-by-name": CreateByName,
    "create-by-fixed-value": CreateByFixedValue
  },
  props: {
    data: {}
  },
  data() {
    this.CREATE_DATA = create_data;
    return {};
  },
  methods: {
    // openDialog() {
    //   spinalPanelManagerService.openPanel("configureGenerationDialog", {
    //     callback: (regex, fixed) => {
    //       this.data.category.regex = regex;
    //       this.data.category.fixed = fixed;
    //     }
    //   });
    // }

    setAttributeValue(res) {
      this.data.category.contains = res.contains;
      this.data.category.name = res.name;
      this.data.category.regex = res.regex;
    },

    setNameValue(res) {
      this.data.category.separator = res.separator;
      this.data.category.index = res.index;
    },

    setFixedValue(res) {
      this.data.category.fixedValue = res.name;
    }
  }
};
</script>

<style scoped>
.sub-content {
  padding: 16px;
  border: 1px solid gray;
  margin-bottom: 10px;
}

.sub-content .contentDiv {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.sub-content .contentDiv .radiosDiv {
  width: 100%;
  display: flex;
  /* justify-content: space-around; */
  margin-bottom: 10px;
}

.sub-content .contentDiv .content {
  width: 100%;
}

.sub-content .contentDiv .content .fixedInput {
  width: 100%;
}

.sub-content .contentDiv .content .dynamicDiv {
  width: 100%;
  display: flex;
}

.sub-content .contentDiv .content .dynamicDiv .inputDiv {
  width: 80%;
}

.sub-content .contentDiv .content .inputDiv {
  margin: 0px;
  /* padding: 0px; */
}

/* .sub-content .contentDiv .checkboxDiv {
  height: 100%;
  flex: 0 0 130px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}



.sub-content .contentDiv .dynamicDialog {
  flex: 0 0 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
} */
</style>