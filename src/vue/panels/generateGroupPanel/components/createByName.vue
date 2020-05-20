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
  <div class="div_container">
    <div class="sub-container">
      <md-field>
        <label>Separator</label>
        <md-input v-model="separator"
                  @blur="setValue"></md-input>
      </md-field>
    </div>

    <div class="sub-container">
      <md-field>
        <label>Index</label>
        <md-input v-model="position"
                  type="number"
                  :min="1"
                  @blur="setValue"></md-input>
      </md-field>
    </div>

  </div>
</template>

<script>
export default {
  name: "create-by-name",
  props: {
    propsSeparator: {},
    propsPosition: {}
  },
  data() {
    return {
      separator: "",
      position: 1
    };
  },
  methods: {
    setValue() {
      this.$emit("setValue", {
        separator: this.separator,
        index: this.position
      });
    }
  },
  watch: {
    propsSeparator() {
      if (this.propsSeparator !== this.separator)
        this.separator = this.propsSeparator;
    },

    propsPosition() {
      if (this.propsPosition !== this.position)
        this.position = this.propsPosition;
    }
  }
};
</script>

<style scoped>
.div_container {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.div_container .sub-container {
  width: 40%;
}
</style>

<style>
.div_container .sub-container .md-field {
  min-height: 0px;
}
</style>