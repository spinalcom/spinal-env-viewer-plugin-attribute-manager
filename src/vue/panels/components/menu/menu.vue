<template>
  <!-- <div>
    <v-menu v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x>
      <template v-slot:activator="{ menu }">
        <v-btn flat
               icon
               color="white"
               @click.stop="SeeOrHideMenu"
               title="add attribute">
          <v-icon>add</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="hints"
                        color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable hints</v-list-tile-title>
          </v-list-tile>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat
                 @click="menu = false">Cancel</v-btn>
          <v-btn color="primary"
                 flat
                 @click="menu = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div> -->

  <md-menu md-size="big"
           md-direction="bottom-end"
           :md-active="menu"
           :md-close-on-click="false"
           :md-close-on-select="false"
           @md-closed="SeeOrHideMenu">

    <md-button class="md-icon-button md-menu-trigger"
               @click.stop="SeeOrHideMenu">
      <md-icon>add_circle_outline</md-icon>
    </md-button>

    <md-menu-content>
      <h1>hello World</h1>
    </md-menu-content>
  </md-menu>

</template>

<script>
export default {
  name: "menuComponent",
  props: {},
  data() {
    return {
      menu: false
    };
  },
  methods: {
    SeeOrHideMenu() {
      this.menu = !this.menu;
    }
  }
};
</script>

<style scoped>
.menuContainer {
  width: 200px;
  height: 200px;
  z-index: 99999999 !important;
}
</style>