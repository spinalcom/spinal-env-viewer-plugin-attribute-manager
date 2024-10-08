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
  <div class="fabs">
    <md-speed-dial v-if="!editMode" md-direction="top" md-event="click">
      <md-speed-dial-target class="md-fab md-mini md-primary">
        <md-icon class="md-morph-initial">menu</md-icon>
        <md-icon class="md-morph-final">menu_open</md-icon>
      </md-speed-dial-target>

      <md-speed-dial-content class="mdSpeedDialBtn">
        <md-button v-for="(btn, index) in buttons" :key="index" class="md-primary md-dense"
          @click="sendEvent(btn.event)">
          <md-icon>{{ btn.icon }}</md-icon>
          &nbsp;
          {{ btn.text }}
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>

    <!-- IF EDIT MODE -->
    <div v-if="editMode" class="editModeBtn">
      <md-button title="Cancel modification" @click="validateOrCancel(false)" class="md-fab md-mini md-plain">
        <md-icon>clear</md-icon>
      </md-button>

      <change-col-value :columns="headerDisplayed" :itemsSelected="itemsSelected" @setValueToColumn="setValueToColumn">
      </change-col-value>

      <md-button title="Validate modification" @click="validateOrCancel(true)" class="md-fab md-mini md-primary">
        <md-icon>done</md-icon>
      </md-button>
    </div>

  </div>
</template>

<script>
import ChangeColValue from "../tooltips/changeCol.vue";

export default {
  name: "fabComponent",
  components: {
    "change-col-value": ChangeColValue
  },
  props: { editMode: {}, itemsSelected: {}, headerDisplayed: {} },
  data() {
    this.buttons = [
      {
        icon: "build",
        text: "Classify in group",
        event: "generateGroup"
      },
      {
        icon: "settings_applications",
        text: "Configuration",
        event: "configure",
        action: this.OpenParamsDialog
      },
      {
        icon: "link",
        text: "Link to group",
        event: "link",
        action: this.LinkItem
      },
      {
        icon: "edit",
        text: "Active edit mode",
        event: "edit",
        action: this.ActiveEditMode
      }
    ];

    return {};
  },
  methods: {
    sendEvent(name) {
      this.$emit(name);
    },
    setValueToColumn(res) {
      this.$emit("setToColumn", res);
    },
    validateOrCancel(res) {
      this.$emit("valid", res);
    }
  }
};
</script>

<style scoped>
.fabs {
  width: 100%;
  height: 100%;
}

.fabs .mdSpeedDialBtn {
  z-index: 999;
}

.fabs>* {
  justify-content: center;
  align-items: flex-end;
}

.fabs .editModeBtn {
  display: flex;
  flex-direction: row;
}
</style>