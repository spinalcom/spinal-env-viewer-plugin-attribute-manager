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
  <div class="_container">
    <div class="content">

      <context-vue :data="data"
                   :type="type"></context-vue>

      <!-- <md-divider></md-divider> -->

      <category-vue :data="data"></category-vue>

      <!-- <md-divider></md-divider> -->

      <group-vue :data="data"></group-vue>

    </div>
  </div>
</template>

<script>
import contextVue from "./context.vue";
import categoryVue from "./category.vue";
import groupVue from "./group.vue";

export default {
  name: "configuration",
  props: {
    data: {},
    type: {}
  },
  components: {
    "context-vue": contextVue,
    "category-vue": categoryVue,
    "group-vue": groupVue
  },
  data() {
    return {};
  },
  methods: {
    // goToNext() {
    //   this.$emit("next", { id: "first", index: "second" });
    // }
  }
};
</script>

<style scoped>
._container {
  width: 100%;
  height: 100%;
  padding: 0 0 0 0;
}

._container .content {
  width: 100%;
  height: 100%;
}

/* .container .buttons {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
} */
</style>