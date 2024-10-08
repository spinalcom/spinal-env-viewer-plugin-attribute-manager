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
  <div class="list">

    <div class="content">

      <md-field>
        <label>configuration name</label>
        <md-input v-model="data.paramName"></md-input>
      </md-field>

      <display-list-component :categories="data.categories"
        :message="'No category found create. Create one with the button below !'" @add="addAttributes">
      </display-list-component>
    </div>

    <div class="header">

      <div class="headerButtons addCategoryBtn">
        <menu-component @add="addAttributes"></menu-component>

        <div class="trigger">
          <md-button title="add category" class="md-dense md-primary" :disabled="disableSaveButton()"
            @click="saveConfiguration">
            <md-icon>save_alt</md-icon>
            &nbsp;
            Save configuration
          </md-button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import menuComponent from "../../../vue/panels/attributePanel/components/tooltips/addItem.vue";
import displayListComponent from "../components/displayList.vue";

import utilities from "../../../js/utils/utilities";

export default {
  name: "createParamsComponent",
  components: {
    "menu-component": menuComponent,
    "display-list-component": displayListComponent
  },
  data() {
    return {
      data: {
        paramName: "",
        categories: []
      }
    };
  },
  methods: {
    disableSaveButton() {
      return (
        this.data.paramName.trim().length === 0 ||
        this.data.categories.length === 0
      );
    },
    addAttributes(res) {
      if (res.category && res.label) {
        let found = this.data.categories.find(el => {
          return el.name === res.category;
        });

        if (found) {
          let attrFound = found.attributes.find(el => el.name === res.label);
          if (typeof attrFound === "undefined") {
            found.attributes.push({
              show: false,
              name: res.label,
              id: Date.now()
            });
          }
        }
      } else if (res.category) {
        let found = this.data.categories.find(el => el.name === res.category);

        if (!found) {
          this.data.categories.push({
            id: Date.now(),
            name: res.category,
            attributes: []
          });
        }
      }
    },

    saveConfiguration() {
      utilities
        .createConfiguration(this.data.paramName.trim(), this.data.categories)
        .then(res => {
          if (typeof res !== "undefined") {
            this.data.paramName = "";
            this.data.categories = [];
          }
          this.$emit("refresh");
        });
    }
  }
};
</script>

<style scoped>
.list {
  width: 100%;
  height: 100%;
  /* border: 1px solid red; */
}

.list .header {
  width: 100%;
  height: 60px;
}

.list .header .headerButtons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}

/* .list .header .headerButtons.addCategoryBtn .trigger {
  margin-left: 10px;
} */

.list .content {
  width: 100%;
  height: calc(100% - 80px);
  /* overflow: auto; */
}
</style>

<style>
.list .header .headerButtons.addCategoryBtn .trigger {
  border: 1px solid #448aff;
}
</style>