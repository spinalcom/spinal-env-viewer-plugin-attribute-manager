<template>
  <v-popover trigger="manual"
             :open="show"
             :auto-hide="false"
             offset="16">
    <md-button class="md-icon-button"
               title="add attribute"
               @click="open">
      <md-icon>add</md-icon>
    </md-button>

    <template slot="popover">
      <div class="popoverContainer">
        <div class="_popoverContent">

          <md-field class="tooltip-content">
            <label>Group name</label>
            <md-input v-model="groupName"></md-input>
          </md-field>

          <md-field class="tooltip-content">
            <label>Label Name</label>
            <md-input v-model="attributeName"></md-input>
          </md-field>

        </div>

        <div class="_popoverBtn">
          <a class="btn"
             v-close-popover
             @click="open">Close</a>

          <a class="btn"
             v-close-popover>OK</a>
        </div>
      </div>

    </template>

  </v-popover>

</template>

<script>
export default {
  name: "createAttributeTooltip",
  props: {
    show: {
      default: false
    }
  },
  data() {
    return {
      groupName: "",
      attributeName: ""
    };
  },
  methods: {
    open() {
      this.$emit("open");
    }
  }
};
</script>

<style scoped>
.popoverContainer {
  width: 200px;
  height: 200px;
  color: black;
}

.popoverContainer ._popoverContent {
  width: 100%;
  height: calc(100% - 40px);
}

.popoverContainer ._popoverBtn {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.popoverContainer ._popoverBtn .btn {
  font-size: 15px;
  margin-right: 10px;
  cursor: pointer;
}
</style>

<style lang="scss">
.tooltip {
  // ...

  &.popover {
    // $color: #f9f9f9;
    $color: rgb(44, 43, 43);

    .popoverContainer {
      pointer-events: auto;
    }

    .popover-inner {
      background: $color;
      color: black;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }
}
</style>