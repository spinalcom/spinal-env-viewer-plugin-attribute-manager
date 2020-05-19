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
    <md-subheader>Context</md-subheader>
    <div class="contentDiv">
      <div class="radios">
        <md-radio v-model="data.context.create"
                  :value="false"
                  @change="changeRadio"
                  class="md-primary">Select Context</md-radio>

        <md-radio v-model="data.context.create"
                  :value="true"
                  @change="changeRadio"
                  class="md-primary">Create Context</md-radio>
      </div>

      <div class="inputDiv"
           v-if="data.context.create">
        <md-field>
          <label>Context Name</label>
          <md-input v-model="data.context.name"></md-input>
        </md-field>
      </div>

      <div class="inputDiv"
           v-else>
        <md-field>
          <label for="context">Select context</label>
          <md-select v-model="data.context.id"
                     name="context"
                     id="context"
                     @md-selected="selectItem">
            <md-option v-if="contexts.length === 0"
                       disabled>No Item</md-option>

            <md-option v-for="(item,index) in contexts"
                       :value="item.id"
                       :key="index">{{item.name}}</md-option>

          </md-select>
        </md-field>
      </div>

    </div>
  </div>
</template>

<script>
import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

export default {
  name: "contextTemplate",
  props: ["data", "type"],
  data() {
    return {
      contexts: []
    };
  },
  mounted() {
    this.getContexts();
  },
  methods: {
    async getContexts() {
      this.contexts = await groupManagerService.getGroupĈontexts(this.type);
    },
    selectItem(id) {
      const item = this.contexts.find(el => el.id === id);

      if (item) this.data.context.name = item.name;
    },
    changeRadio() {
      this.data.context.name = "";
      this.data.context.id = "";
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
  /* justify-content: space-between; */
}

.sub-content .contentDiv .inputDiv {
  width: 100%;
  display: flex;
  align-items: center;
}

.sub-content .contentDiv .radios {
  width: 100%;
  display: flex;
  align-items: center;
  /* padding-top: 16px; */
}
</style>

<style>
.inputDiv .md-field {
  min-height: unset;
  margin: 0px;
}
</style>