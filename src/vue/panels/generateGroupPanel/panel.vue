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
  <div class="_container">

    <md-steppers md-vertical
                 class="steppers"
                 :md-dynamic-height="true"
                 @md-changed="changeStep">

      <md-step id="first"
               md-label="Selection Step"
               md-description="select">
        <md-content class="step-container md-scrollbar">
          <selection-step :data="data"
                          :type="type"
                          @changeType="changeType"></selection-step>
        </md-content>

      </md-step>

      <md-step id="second"
               md-label="Configuration Step"
               md-description="configure"
               :md-error="errorInConfig">
        <md-content class="step-container md-scrollbar">
          <configuration-step :data="data"
                              :type="type"></configuration-step>
        </md-content>

      </md-step>

      <md-step id="third"
               md-label="Creation Step"
               md-description="create">

        <md-content class="step-container md-scrollbar">
          <launch-generation-step :data="data"
                                  :type="type"
                                  :error="firstStepError">
          </launch-generation-step>
        </md-content>

      </md-step>

    </md-steppers>
  </div>
</template>


<script>
import ConfigurationStep from "./components/configurationStep.vue";
import launchGenerationStep from "./components/launchGenerationStep.vue";
import selectionStep from "./components/selectionStep.vue";

import create_data from "./js/data.js";

export default {
  name: "generateGroupPanel",
  components: {
    "configuration-step": ConfigurationStep,
    "launch-generation-step": launchGenerationStep,
    "selection-step": selectionStep
  },
  data() {
    this.CREATE_DATA = create_data;

    return {
      active: "first",
      errorInConfig: null,
      first: false,
      second: false,
      third: false,
      type: undefined,
      firstStepError: false,
      data: {
        items: [],
        context: {
          create: false,
          id: "",
          name: ""
        },
        category: {
          createBy: this.CREATE_DATA.attribute,
          contains: false,
          name: "",
          regex: "",
          separator: "",
          index: 1,
          fixedValue: ""
        },
        group: {
          createBy: this.CREATE_DATA.attribute,
          contains: false,
          name: "",
          regex: "",
          separator: "",
          index: 1,
          fixedValue: ""
        }
      },
      verification: {
        context: {
          isVerified: false,
          message: ""
        },
        category: {
          isVerified: false,
          message: ""
        },
        group: {
          isVerified: false,
          message: ""
        }
      }
    };
  },
  methods: {
    opened(params) {
      this.type = params.type;
      this.data.items = params.items;
    },

    errorInFirstStep() {
      this.errorInConfig = "This is an error!";
    },

    changeStep(step) {
      if (step === "second") {
        this.errorInConfig = null;
      } else if (step === "third") {
        const contextIsOk = this.contextIsVerified();
        const categoryisOk = this.categoryOrGroupIsVerified(this.data.category);
        const groupIsOk = this.categoryOrGroupIsVerified(this.data.group);

        if (!contextIsOk || !categoryisOk || !groupIsOk) {
          this.firstStepError = true;
          this.errorInConfig = "This is an error!";
        } else {
          this.firstStepError = false;
        }
      }
    },

    changeType(type) {
      this.type = type;
    },

    contextIsVerified() {
      if (this.data.context.create) {
        return this.data.context.name.trim().length > 0;
      } else {
        return (
          this.data.context.name.trim().length > 0 &&
          this.data.context.id.trim().length > 0
        );
      }
    },

    categoryOrGroupIsVerified(info) {
      // createBy: this.CREATE_DATA.attribute,
      //     contains: false,
      //     name: "",
      //     regex: "",
      //     separator: "",
      //     index: -1

      if (info.createBy === this.CREATE_DATA.attribute) {
        return info.regex.toString().trim().length > 0;
      } else if (info.createBy === this.CREATE_DATA.name) {
        return parseInt(info.index) >= 1;
        // return info.separator.length > 0 && parseInt(info.index) >= 1;
      } else if (info.createBy === this.CREATE_DATA.fixed) {
        return info.fixedValue.trim().length > 0;
      }
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
  background-color: transparent;
}

._container .steppers .step-container {
  height: 100%;
  max-height: 450px;
  padding: 16px;
  overflow: hidden;
  overflow-y: auto;
  background-color: transparent;
}
</style>

<style>
._container .md-steppers.md-vertical .md-stepper-content {
  padding: 0 0 0 35px;
}

/* ._container .md-steppers.md-steppers.md-vertical .md-stepper-content.md-active {
  max-height: calc(100% - 180px);
} */
</style>