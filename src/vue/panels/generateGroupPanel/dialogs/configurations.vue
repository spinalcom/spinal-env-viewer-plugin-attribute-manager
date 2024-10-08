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
  <md-dialog class="mdDialogContainer" :md-active.sync="showDialog" @md-closed="closeDialog(false)">

    <md-dialog-title class="dialogTitle">
      Use Regex
    </md-dialog-title>

    <md-dialog-content class="dialogContent">

      <div class="content">

        <!-- <div class="advancedCheckbox">
          <md-checkbox v-model="advanced"
                       class="md-primary">Use advanced option</md-checkbox>
        </div> -->

        <!-- 
        //////////////////////////////////////////
        //  NOT Advanced
        //////////////////////////////////////////
     -->
        <!-- <div class="normal"
             v-if="!advanced">

          <md-list>
            <md-list-item>
              <md-field>
                <label>name</label>
                <md-input v-model="value"></md-input>
              </md-field>
            </md-list-item>

            <md-list-item>
              <md-checkbox v-model="contains"
                           class="md-primary">
                select the elements which contain this key</md-checkbox>
            </md-list-item>
          </md-list>

        </div> -->
        <!-- 
        //////////////////////////////////////////
        //  Advanced
        //////////////////////////////////////////
     -->
        <div class="advanced">
          <md-list>
            <md-list-item>
              <md-field class="_mdField">
                <label>Regex</label>
                <span class="md-prefix">{{ delimiterV }}</span>
                <md-input v-model="value" palceholder="Regex"></md-input>
                <span class="md-icon md-suffix">{{ delimiterV }}</span>

              </md-field>
            </md-list-item>

            <md-list-item>
              <md-field class="_mdField">
                <label>Flags</label>

                <md-select v-model="flags" name="flags" id="flags" md-dense multiple>

                  <md-option v-for="(flag, index) in flagsList" :key="index" :value="flag.value">{{ flag.name
                    }}</md-option>

                </md-select>

              </md-field>

            </md-list-item>

          </md-list>
        </div>
      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog(false)">Close</md-button>

      <md-button class="md-primary" @click="closeDialog(true)">Save</md-button>

    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import flagsList from "../js/flags.js";
import create_data from "../js/data.js";

export default {
  name: "configureDialog",
  props: ["onFinised"],
  data() {
    this.CREATE_DATA = create_data;
    this.flagsList = flagsList;

    return {
      showDialog: true,
      value: "",
      advanced: true,
      contains: false,
      delimiterV: "/",
      flags: [],

      data: {
        fixed: true
      },
      callback: null
    };
  },
  methods: {
    opened(params) {
      this.callback = params.callback;
    },
    removed(option) {
      if (option) {
        const regex = this.getRegex(
          this.value,
          this.advanced,
          this.contains,
          this.flags.join(""),
          this.delimiterV
        );

        if (this.callback) this.callback(regex, this.data.fixed);
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    getRegex(value, advanced, contains, flag, delimiter = "/") {
      let regex;

      switch (advanced) {
        case false:
          const text = contains ? `${RegExp.escape(value.trim())}` : `^${RegExp.escape(value.trim())}$`;
          regex = new RegExp(text, "i");
          break;
        case true:
          regex = new RegExp(value, flag);
          break;
      }

      return regex;
    }
  },
  computed: {
    getLabel() {
      switch (this.data.createBy) {
        case this.CREATE_DATA.attribute:
          return "Attribute Key";
        case this.CREATE_DATA.name:
          return "name key";
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.mdDialogContainer {
  width: 500px;
  height: 500px;
}

.mdDialogContainer .dialogTitle {
  text-align: center;
}

.mdDialogContainer .dialogContent {
  padding-bottom: 0px;
}

.mdDialogContainer .dialogContent ._title {
  display: flex;
  /* justify-content: space-between; */
}

.mdDialogContainer .dialogContent .advancedCheckbox {
  padding-left: 16px;
}

/* .mdDialogContainer .dialogContent .sub-content {
  width: 100%;
  height: 33%;
} */
</style>