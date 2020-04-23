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
  <md-content class="container md-scrollbar">

    <div class="header">
      <v-btn outline
             color="#448aff">Import</v-btn>

      <v-btn outline
             color="#448aff">Export</v-btn>
    </div>

    <configuration-component class="configuration"
                             v-if="currentConfiguration"
                             :configurationSelected="currentConfiguration"
                             :currentConfiguration="currentConfiguration">
    </configuration-component>

    <div class="empty"
         v-else>
      No configuration Set
    </div>

  </md-content>
</template>

<script>
import ConfigurationsComponent from "./configurations.vue";

export default {
  name: "current-configuration-template",
  components: {
    "configuration-component": ConfigurationsComponent
  },
  props: {
    currentConfiguration: {}
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  overflow-x: auto;
}

.container .header {
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}

.container .configuration {
  width: 100%;
  height: calc(100% - 60px);
}

.container .empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
}
</style>