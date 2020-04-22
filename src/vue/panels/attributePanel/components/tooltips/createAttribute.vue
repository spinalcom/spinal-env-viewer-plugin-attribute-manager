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
  <v-popover trigger="manual"
             :open="show"
             :auto-hide="false"
             offset="16">
    <!-- <md-button class="md-primary attr_btn"
               title="add attribute"
               @click="open">
      <md-icon>add</md-icon>
      ADD ATTRIBUTE
    </md-button> -->

    <md-button @click="open"
               class="md-elevation-4 md-dense"
               style="background-color : #448aff">
      <md-icon>add</md-icon>
      &nbsp;
      Add attribute
    </md-button>

    <template slot="popover">
      <div class="popoverContainer">
        <div class="_popoverContent">

          <md-field class="tooltip-content">
            <label>Category name</label>
            <md-input v-model="categoryName"></md-input>
          </md-field>

          <md-field class="tooltip-content">
            <label>Label Name</label>
            <md-input v-model="attributeName"></md-input>
          </md-field>

        </div>

        <div class="_popoverBtn">
          <a class="btn"
             @click="open">Close</a>

          <a class="btn"
             @click="Validate">OK</a>
        </div>
      </div>

    </template>

  </v-popover>

</template>

<script>
import attributeService from "../../../../../services";
export default {
  name: "createAttributeTooltip",
  props: {
    show: {
      default: false
    },
    itemFiltered: {
      required: true
    }
  },
  data() {
    return {
      categoryName: "",
      attributeName: ""
    };
  },
  methods: {
    open() {
      this.$emit("open");
    },
    Validate() {
      if (this.itemFiltered.length > 0) {
        let promises = this.itemFiltered.map(el => {
          return attributeService.createAttribute(
            el.id,
            this.categoryName,
            this.attributeName
          );
        });

        return Promise.all(promises).then(() => {
          this.$emit("validate");
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