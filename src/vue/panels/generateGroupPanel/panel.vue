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
  <div class="_container"
       v-if="data && type">

    <md-steppers md-vertical
                 class="steppers"
                 :md-dynamic-height="true">
      <md-step id="first"
               md-label="Configuration Step"
               md-description="configure">
        <configuration-step :data="data"
                            :type="type"></configuration-step>
      </md-step>

      <md-step id="second"
               md-label="Creation Step"
               md-description="create">
        hello world
      </md-step>

    </md-steppers>
  </div>
</template>


<script>
import ConfigurationStep from "./components/configuration.vue";

export default {
  name: "generateGroupPanel",
  components: {
    "configuration-step": ConfigurationStep
  },
  data() {
    return {
      active: "first",
      first: false,
      second: false,
      type: undefined,
      data: {
        context: {
          create: false,
          id: "",
          name: ""
        }
      }
    };
  },
  methods: {
    opened(params) {
      this.type = params.type;
    }

    // setDone(res) {
    //   this[res.id] = true;

    //   if (res.index) {
    //     this.active = res.index;
    //   }
    // }
  }
};
</script>

<style scoped>
._container {
  width: 100%;
  height: calc(100% - 15px);
}

._container .steppers {
  width: 100%;
  height: 100%;
}
</style>

<style>
._container .md-steppers.md-vertical .md-stepper-content {
  padding: 0 0 0 35px;
}
</style>