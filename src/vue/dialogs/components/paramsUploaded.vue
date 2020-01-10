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
  <div class="list"
       v-if="currentConfiguration">

    <div class="header">
      <div>{{currentConfiguration.name}}</div>

      <!-- <v-alert :value="true"
               color="green"
               outline
               icon="check_circle">
        current configuration.
      </v-alert> -->

    </div>

    <display-list-component class="content md-scrollbar"
                            :categories="currentConfiguration.categories"
                            :editMode="false"
                            :message="'No category found create. Create one with the button below !'">
    </display-list-component>
  </div>

  <div class="empty"
       v-else>
    No current configuration is set
  </div>

</template>

<script>
import displayListComponent from "../components/displayList.vue";

export default {
  name: "currentParams",
  components: {
    "display-list-component": displayListComponent
  },
  props: {
    currentConfiguration: {}
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.list {
  width: 100%;
  height: 100%; /* border: 1px solid red; */
}

.list .content {
  width: 100%;
  height: calc(100% - 60px);
}

.list .header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 20px;
  text-transform: uppercase;
  align-items: center;
  justify-content: space-between;
}

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
</style>