<template>
  <div class="list">

    <div class="content">

      <md-field>
        <label>configuration name</label>
        <md-input v-model="data.paramName"></md-input>
      </md-field>

      <display-list-component :categories="data.categories"
                              :message="'No category found create. Create one with the button below !'"
                              @add="addAttributes">
      </display-list-component>

      <!-- <md-list :md-expand-single="false">
        <md-list-item v-for="(item,index) in data.categories"
                      :key="index"
                      md-expand>

          <span class="md-list-item-text">{{item.name}}</span>

          <menu-component :category="item.name"
                          @add="addAttributes"></menu-component>

          <md-list slot="md-expand">
            <md-list-item class="md-inset"
                          v-for="(attr,i) in item.attributes"
                          :key="i">
              <md-checkbox class="md-primary"
                           v-model="attr.show" />
              <span class="md-list-item-text">{{attr.name}}</span>
            </md-list-item>

          </md-list>
        </md-list-item>
      </md-list> -->
    </div>

    <div class="header">

      <div class="headerButtons addCategoryBtn">
        <menu-component @add="addAttributes"></menu-component>

        <div class="trigger">
          <md-button title="add category"
                     class="md-dense md-primary"
                     :disabled="disableSaveButton()"
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
import menuComponent from "../../../vue/panels/components/tooltips/addItem.vue";
import displayListComponent from "../components/displayList.vue";

import utilities from "../../../js/utilities";

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
        });
    }
  }
};
</script>

<style scoped>
.list {
  width: 100%;
  height: 100%; /* border: 1px solid red; */
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