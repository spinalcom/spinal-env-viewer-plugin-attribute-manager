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
                    no-action>
        <v-list-tile slot="activator">

          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>

            <menu-component :category="item.name"
                            @add="addAttributes"></menu-component>

          </v-list-tile-action>

          <v-list-tile-action>
            <v-btn flat
                   icon
                   small
                   color="red"
                   title="remove"
                   @click.stop="remove(true,item)">
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
            <v-checkbox color="blue"
                        v-model="subItem.show"></v-checkbox>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{subItem.name}}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn icon
                   flat
                   small
                   color="red"
                   title="remove"
                   @click="remove(false,subItem)">
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
    }
  },
  methods: {
    addAttributes(res) {
      this.$emit("add", res);
    },
    remove(item, isCategory) {
      if (isCategory) {
        this.$emit("remove-category", item);
      } else {
        this.$emit("remove-attribute", item);
      }
    }
  }
};
</script>

<style scoped>
.myListContainer {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
}

.myListContainer .listContainer {
  width: 100%;
  height: 100%;
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