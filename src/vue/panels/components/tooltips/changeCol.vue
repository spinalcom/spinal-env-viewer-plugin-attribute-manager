<template>
  <v-popover :auto-hide="false"
             offset="16">
    <md-button class="md-primary attr_btn"
               title="add attribute">
      <md-icon>view_column</md-icon>
      EDIT COLUMN
    </md-button>

    <template slot="popover">
      <div class="popoverContainer">
        <div class="_popoverContent">

          <md-field class="tooltip-content">
            <md-select v-model="columnSelected"
                       placeholder="Select Column"
                       name="columns"
                       id="columns">
              <md-option v-for="(head,index) in columns"
                         :key="index"
                         :value="`${head.category}/${head.label}`">
                {{`${head.category} / ${head.label}`}}
              </md-option>
            </md-select>
          </md-field>

          <md-field class="tooltip-content">
            <label>Value</label>
            <md-input v-model="value"></md-input>
          </md-field>

        </div>

        <div class="_popoverBtn">
          <a class="btn"
             v-close-popover>Close</a>

          <a class="btn"
             v-close-popover
             @click="Validate">OK</a>
        </div>
      </div>

    </template>

  </v-popover>

</template>

<script>
// import attributeService from "../../../../services";

export default {
  name: "createAttributeTooltip",
  props: {
    columns: {},
    itemsSelected: {}
  },
  data() {
    return {
      columnSelected: "",
      value: ""
    };
  },
  methods: {
    Validate() {
      if (this.itemsSelected && this.value.trim().length > 0) {
        this.$emit("setValueToColumn", {
          value: this.value.trim(),
          column: this.columnSelected
        });
      } else {
        alert("select at least one item !");
      }
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

<style>
.md-select-menu.md-menu-content-bottom-start.md-menu-content-small.md-menu-content.md-theme-default {
  z-index: 99999 !important;
}
</style>