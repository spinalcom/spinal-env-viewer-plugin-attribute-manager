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
    <div class="inputs">
      <md-field md-clearable>
        <label>value</label>
        <md-input v-model="name"
                  @blur="setValue"></md-input>
      </md-field>
    </div>

  </div>
</template>

<script>
export default {
  name: "create-by-fixed-value",
  props: {
    propsName: {}
  },
  data() {
    return {
      name: ""
    };
  },
  methods: {
    setValue() {
      this.$emit("setValue", {
        name: this.name
      });
    }
  },
  watch: {
    propsName() {
      if (this.propsName !== this.name) this.name = this.propsName;
    }
  }
};
</script>

<style scoped>
.div_container {
  width: 100%;
}
</style>

<style>
.div_container .inputs .md-field {
  /* margin: 0px; */
  /* padding: 0px; */
  min-height: 0px;
}
</style>