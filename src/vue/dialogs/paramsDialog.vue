<template>
  <md-dialog class="mdDialogContainer paramsDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title style="text-align : center">Params</md-dialog-title>
    <md-dialog-content>
      <div class="list">
        <md-list :md-expand-single="false">
          <md-list-item v-for="(item,index) in data"
                        :key="index"
                        md-expand>

            <span class="md-list-item-text">{{item.category}}</span>

            <menu-component :category="item.category"></menu-component>

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

export default {
  name: "paramDialogComponent",
  components: {
    "menu-component": menuComponent
  },
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      data: []
    };
  },
  methods: {
    opened(option) {
      this.data = this.formatData(option.header);

      console.log("data", this.data);
    },
    removed(option) {
      if (option) {
        console.log("hello");
      }
      this.showDialog = false;
    },
    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    addLabel() {
      console.log("addLabel");
    },
    formatData(headers) {
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
    }
  }
};
</script>

<style scoped>
.mdDialogContainer.paramsDialogContainer {
  width: 500px !important;
  height: 600px;
}
</style>