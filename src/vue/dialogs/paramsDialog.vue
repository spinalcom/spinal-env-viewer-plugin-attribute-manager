<template>
  <md-dialog class="mdDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title>Params</md-dialog-title>
    <md-dialog-content>
      <h1>Hello World !!!</h1>
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