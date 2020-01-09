<template>
  <div class="list">

    <!-- <md-list :md-expand-single="false">
      <md-list-item v-for="(item,index) in data"
                    :key="index"
                    md-expand>

        <span class="md-list-item-text">{{item.category}}</span>

        <menu-component :category="item.category"
                        @add="addLabel"></menu-component>

        <md-list slot="md-expand">
          <md-list-item class="md-inset"
                        v-for="(attr,i) in item.attributes"
                        :key="i">
            <md-checkbox class="md-primary"
                         v-model="attr.show" />
            <span class="md-list-item-text">{{attr.label}}</span>
          </md-list-item>

        </md-list>
      </md-list-item>
    </md-list>

    <menu-component class="addCategoryBtn"
                    @add="addLabel"></menu-component> -->

    <div class="emptyList"
         v-if="data.length === 0">
      No Data found !!!
    </div>

  </div>
</template>

<script>
import menuComponent from "../../../vue/panels/components/tooltips/addItem.vue";

export default {
  name: "editParamsComponent",
  components: {
    "menu-component": menuComponent
  },
  props: {
    data: {
      type: Array,
      default: new Array()
    }
  }
};
</script>

<style scoped>
.list {
  width: 100%;
  height: 100%; /* border: 1px solid red; */
}

/* .mdDialogContainer.paramsDialogContainer .list .emptyList {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
} */
</style>