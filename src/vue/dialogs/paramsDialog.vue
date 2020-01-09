<template>
  <md-dialog class="mdDialogContainer paramsDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title style="text-align : center">Params</md-dialog-title>
    <md-dialog-content style="overflow : hidden">

      <md-tabs class="myTabs"
               md-alignment="centered"
               @md-changed="changeTab">
        <md-tab id="current-param-tab"
                md-label="Current configuration"
                md-icon="offline_pin"></md-tab>

        <md-tab id="create-param-tab"
                md-label="Create configuration"
                md-icon="add"></md-tab>

        <md-tab id="all-params-tab"
                md-label="All configuration"
                md-icon="settings_applications"></md-tab>

      </md-tabs>

      <div class="tabsContent">

        <current-param v-if="tabDisplayed === 0"></current-param>

        <edit-param :data="data"
                    v-if="tabDisplayed === 1"></edit-param>

        <create-param v-if="tabDisplayed === 2"></create-param>

      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <!-- <md-button class="md-primary"
                 @click="closeDialog(true)">Save</md-button> -->
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
// import menuComponent from "../../vue/panels/components/tooltips/addItem.vue";
import utilities from "../../js/utilities";

import editParamsComponent from "./components/editParamsComponent.vue";
import currentConfiguration from "./components/paramsUploaded.vue";
import addConfiguration from "./components/createParamsComponent.vue";

export default {
  name: "paramDialogComponent",
  components: {
    "edit-param": editParamsComponent,
    "current-param": currentConfiguration,
    "create-param": addConfiguration
  },
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      typeSelected: "",
      data: [],
      callback: null,
      tabDisplayed: 0
    };
  },
  methods: {
    async opened(option) {
      this.typeSelected = option.typeSelected;
      this.callback = option.callback;

      // this.data = await this.formatData(option.header, option.typeSelected);
    },

    removed(option) {
      // if (option) {
      //   utilities.addElement(this.typeSelected, this.data);
      // }

      this.callback();
      this.showDialog = false;
    },
    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    // addLabel(res) {
    //   if (res.category && res.label) {
    //     let found = this.data.find(el => {
    //       return el.category === res.category;
    //     });

    //     if (found) {
    //       let attrFound = found.attributes.find(el => el.label === res.label);
    //       if (typeof attrFound === "undefined") {
    //         found.attributes.push({
    //           show: false,
    //           label: res.label
    //         });
    //       }
    //     }
    //   } else if (res.category) {
    //     let found = this.data.find(el => el.category === res.category);

    //     if (!found) {
    //       this.data.push({
    //         category: res.category,
    //         attributes: []
    //       });
    //     }
    //   }
    // },

    formatData(headers, type) {
      return utilities.getElements(type).then(el => {
        if (el && el.get().length > 0) {
          return el.get();
        }

        let res = [];
        headers.forEach(el => {
          let found = res.find(el2 => el2.category === el.category);

          if (found) {
            found.attributes.push({
              show: false,
              label: el.label,
              date: el.date
            });
          } else {
            res.push({
              category: el.category,
              attributes: [
                {
                  show: false,
                  label: el.label,
                  date: el.date
                }
              ]
            });
          }
        });

        return res;
      });
    },

    changeTab(activeTab) {
      console.log("yes");
      switch (activeTab) {
        case "current-param-tab":
          console.log("0");
          this.tabDisplayed = 0;
          break;

        case "all-params-tab":
          console.log("1");
          this.tabDisplayed = 1;
          break;

        case "create-param-tab":
          console.log("2");
          this.tabDisplayed = 2;
          break;
      }
    }
  }
};
</script>

<style scoped>
.mdDialogContainer.paramsDialogContainer {
  width: 700px !important;
  height: 700px;
}

.mdDialogContainer.paramsDialogContainer .myTabs {
  height: 70px;
}

.mdDialogContainer.paramsDialogContainer .tabsContent {
  width: calc(100% - 70px);
  height: calc(100% - 70px);
  margin: auto;
  margin-top: 10px;
}

.mdDialogContainer.paramsDialogContainer .list .emptyList {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.mdDialogContainer.paramsDialogContainer .list .addCategoryBtn {
  position: absolute;
  bottom: 30px;
  right: 20px;
}
</style>