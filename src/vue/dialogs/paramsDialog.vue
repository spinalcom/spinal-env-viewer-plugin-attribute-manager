<template>
  <md-dialog class="mdDialogContainer paramsDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title style="text-align : center">Params</md-dialog-title>
    <md-dialog-content>
      <h1>Hello World</h1>
      <!-- <div class="list">
        <md-list md-expand-single="false">
          <md-list-item md-expand>

            <span class="md-list-item-text">Category</span>

            <md-list slot="md-expand">
              <md-list-item class="md-inset">World</md-list-item>
              <md-list-item class="md-inset">Europe</md-list-item>
              <md-list-item class="md-inset">South America</md-list-item>
            </md-list>
          </md-list-item>
        </md-list>
      </div> -->

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
export default {
  name: "paramDialogComponent",
  props: ["onFinised"],
  data() {
    return {
      showDialog: true
    };
  },
  methods: {
    opened(option) {
      console.log("option", option);
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