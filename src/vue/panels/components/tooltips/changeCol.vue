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
  <v-popover :auto-hide="false"
             offset="16">
    <!-- <md-button class="md-primary attr_btn"
               title="add attribute">
      <md-icon>view_column</md-icon>
      EDIT COLUMN
    </md-button> -->

    <md-button title="edit column value"
               class="md-fab md-mini md-plain"
               style="background-color : #f39508">
      <md-icon>view_column</md-icon>
    </md-button>

    <template slot="popover">
      <div class="popoverContainer">
        <div class="_popoverContent">

          <md-field class="tooltip-content">
            <md-select v-model="columnSelected"
                       placeholder="Select Column"
                       name="columns"
                       id="columns">

              <md-option v-if="!columnsFiltered || columnsFiltered.length === 0"
                         disabled>No column</md-option>

              <md-option v-for="(head,index) in columnsFiltered"
                         :key="index"
                         :value="`${head.category}/${head.label}`">
                {{`${head.category} / ${head.label}`}}
              </md-option>
            </md-select>
          </md-field>

          <!-- <div class="tooltip-content">
            <md-checkbox v-model="getValueOnBIM"
                         class="md-primary">get BIM Value</md-checkbox>
          </div> -->

          <md-checkbox v-model="useMaquetteValue"
                       class="md-primary">Use maquette value</md-checkbox>

          <md-field class="tooltip-content">
            <label>Value</label>
            <md-input v-model="value"
                      :disabled="useMaquetteValue || (!columnSelected || columnSelected.trim().length === 0)">
            </md-input>
          </md-field>

          <div class="tooltip-content pageSelect">

            <md-radio v-model="pageOnly"
                      class="md-primary"
                      :value="true">This page only</md-radio>

            <md-radio v-model="pageOnly"
                      class="md-primary"
                      :value="false">All page</md-radio>

          </div>

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
      columnsFiltered: [],
      useMaquetteValue: false,
      pageOnly: true,
      value: ""
    };
  },
  mounted() {
    this.columnsFiltered = this.columns.filter(el => {
      const hasNoCategory = typeof el.category !== "undefined";
      const hasNoLabel = typeof el.label !== "undefined";

      return hasNoCategory && hasNoLabel;
    });
  },
  methods: {
    Validate() {
      if (
        this.itemsSelected &&
        (this.value.trim().length > 0 || this.useMaquetteValue)
      ) {
        const value = this.$emit("setValueToColumn", {
          value: this.value.trim(),
          column: this.columnSelected,
          pageOnly: this.pageOnly,
          useMaquetteValue: this.useMaquetteValue
        });
      } else {
        alert("select at least one item, select value !");
      }
    }
  },
  watch: {
    useMaquetteValue() {
      if (this.useMaquetteValue) this.value = "";
    }
  }
};
</script>

<style scoped>
.popoverContainer {
  width: 250px;
  height: 350px;
  color: white;
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