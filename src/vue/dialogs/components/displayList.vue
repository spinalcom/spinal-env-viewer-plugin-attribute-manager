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
  <div class="myListContainer">
    <v-list v-if="categories.length > 0"
            class="listContainer"
            expand
            flat
            dark>
      <v-list-group v-for="(item,index) in categories"
                    :key="index"
                    prepend-icon="keyboard_arrow_down"
                    append-icon=""
                    :one-line="false"
                    no-action>
        <v-list-tile slot="activator">

          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action v-if="editMode">

            <menu-component :category="item.name"
                            @add="addAttributes"></menu-component>

          </v-list-tile-action>

          <v-list-tile-action v-if="editMode">
            <v-btn flat
                   icon
                   small
                   color="red"
                   title="remove"
                   @click.stop="remove(item,true)">
              <v-icon>remove_circle_outline</v-icon>
            </v-btn>
          </v-list-tile-action>

        </v-list-tile>

        <!--
        ---------------------------------------------------------
        |                       SubHeaders                      |
        ---------------------------------------------------------
     -->
        <v-list-tile v-for="(subItem,subIndex) in item.attributes"
                     :key="subIndex">

          <v-list-tile-action>
            <v-checkbox :disabled="!editMode"
                        color="blue"
                        v-model="subItem.show"></v-checkbox>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{subItem.name}}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action v-if="editMode">
            <v-btn icon
                   flat
                   small
                   color="red"
                   title="remove"
                   @click="remove(item,false,subItem)">
              <v-icon>remove_circle_outline</v-icon>
            </v-btn>
          </v-list-tile-action>

        </v-list-tile>

        <!--
        ---------------------------------------------------------
        |                       End SubHeaders                  |
        ---------------------------------------------------------
     -->

      </v-list-group>
    </v-list>

    <div class="emptyList"
         v-if="categories.length === 0">
      {{message}}
    </div>

  </div>

</template>

<script>
import menuComponent from "../../../vue/panels/components/tooltips/addItem.vue";

export default {
  name: "displayListComponent",
  components: {
    "menu-component": menuComponent
  },
  props: {
    categories: {},
    message: {
      type: String,
      default: "No data found"
    },
    editMode: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    addAttributes(res) {
      this.$emit("add", res);
    },
    remove(category, isCategory, attribute) {
      let item = {
        category: category,
        attr: attribute
      };

      this.$emit("remove", item);
    }
  }
};
</script>

<style scoped>
.myListContainer {
  width: 100%;
  height: calc(100% - 50px);
}

.myListContainer .listContainer {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.myListContainer .emptyList {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
</style>