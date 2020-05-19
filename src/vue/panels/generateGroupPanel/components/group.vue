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
    <md-subheader>Group</md-subheader>

    <div class="contentDiv">

      <div class="radiosDiv">

        <md-subheader>Create By using : </md-subheader>

        <md-radio v-model="data.group.createBy"
                  :value="CREATE_DATA.attribute"
                  class="md-primary">Attribute</md-radio>

        <md-radio v-model="data.group.createBy"
                  :value="CREATE_DATA.name"
                  class="md-primary">Name</md-radio>

      </div>

      <div class="content">
        <!-- <md-field class="fixedInput inputDiv"
                  v-if="data.group.fixed">
          <label>Category Name</label>
          <md-input :disabled="!data.group.fixed"
                    v-model="data.group.name"></md-input>
        </md-field> -->

        <div class="dynamicDiv">
          <md-field class="inputDiv">
            <label>regex</label>
            <md-input v-model="data.group.regex"
                      disabled></md-input>

          </md-field>

          <md-button class="md-raised md-primary md-suffix"
                     @click="openDialog">
            <md-tooltip>Create dynamically</md-tooltip>
            Edit
          </md-button>

        </div>

      </div>

    </div>

  </div>
</template>


<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import create_data from "../js/data.js";

export default {
  name: "groupVue",
  props: {
    data: {}
  },
  data() {
    this.CREATE_DATA = create_data;

    return {};
  },
  methods: {
    openDialog() {
      spinalPanelManagerService.openPanel("configureGenerationDialog", {
        callback: (regex, fixed) => {
          this.data.group.regex = regex;
          this.data.group.fixed = fixed;
        }
      });
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