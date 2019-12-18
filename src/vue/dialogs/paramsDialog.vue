<template>
  <md-dialog class="mdDialogContainer paramsDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title style="text-align : center">Params</md-dialog-title>
    <md-dialog-content class="md-scrollbar">
      <div class="list">
        <md-list :md-expand-single="false">
          <md-list-item v-for="(item,index) in data"
                        :key="index"
                        md-expand>

            <span class="md-list-item-text">{{item.category}}</span>

            <menu-component :category="item.category"
                            @add="addLabel"></menu-component>

            <md-list slot="md-expand">
              <md-list-item class="md-inset"
                            v-for="(attr,i) in item.attributes"
                            :key="i">
                <md-checkbox class="md-primary"
                             v-model="attr.show" />
                <span class="md-list-item-text">{{attr.label}}</span>
              </md-list-item>

            </md-list>
          </md-list-item>
        </md-list>

        <div class="emptyList"
             v-if="data.length === 0">
          No Data found !!!
        </div>

        <menu-component class="addCategoryBtn"
                        @add="addLabel"></menu-component>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)">Save</md-button>
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
import menuComponent from "../../vue/panels/components/tooltips/addItem.vue";
import utilities from "../../js/utilities";

export default {
  name: "paramDialogComponent",
  components: {
    "menu-component": menuComponent
  },
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      typeSelected: "",
      data: [],
      callback: null
    };
  },
  methods: {
    async opened(option) {
      this.typeSelected = option.typeSelected;
      this.callback = option.callback;

      this.data = await this.formatData(option.header, option.typeSelected);
    },
    removed(option) {
      if (option) {
        utilities.addElement(this.typeSelected, this.data);
      }

      this.callback();
      this.showDialog = false;
    },
    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    addLabel(res) {
      if (res.category && res.label) {
        let found = this.data.find(el => {
          return el.category === res.category;
        });

        if (found) {
          let attrFound = found.attributes.find(el => el.label === res.label);
          if (typeof attrFound === "undefined") {
            found.attributes.push({
              show: false,
              label: res.label
            });
          }
        }
      } else if (res.category) {
        let found = this.data.find(el => el.category === res.category);

        if (!found) {
          this.data.push({
            category: res.category,
            attributes: []
          });
        }
      }
    },

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
    }
  }
};
</script>

<style scoped>
.mdDialogContainer.paramsDialogContainer {
  width: 500px !important;
  height: 600px;
}

.mdDialogContainer.paramsDialogContainer .list {
  width: 100%;
  height: 100%; /* border: 1px solid red; */
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