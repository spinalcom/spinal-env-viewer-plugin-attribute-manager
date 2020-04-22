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
  <div class="select-content">

    <md-field class="select-field">
      <md-select v-model="itemSelected"
                 name="select-item"
                 id="select-item"
                 :placeholder="placeholder"
                 @md-selected="selectItem">
        <md-option v-if="!data || data.length === 0"
                   disabled>No Item found</md-option>

        <md-option v-for="(item,index) in data"
                   :key="index"
                   :value="item.id">
          {{item.name}}
        </md-option>

      </md-select>
    </md-field>

    <!-- <md-button class="create-button md-icon-button md-primary">
      <md-icon>add</md-icon>
    </md-button> -->

  </div>

</template>

<script>
export default {
  name: "select-template",
  props: {
    placeholder: {
      type: String
    },
    data: {},
    value: {}
  },
  data() {
    return {
      itemSelected: undefined
    };
  },
  methods: {
    selectItem(id) {
      if (id) this.$emit("select", id);
    }
  },
  watch: {
    value() {
      this.itemSelected = this.value;
    }
  }
};
</script>

<style scoped>
.select-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.select-content .select-field {
  min-height: 0px;
}
</style>

<style>
.select-content .create-button .md-ripple {
  padding: 0px;
}
</style>