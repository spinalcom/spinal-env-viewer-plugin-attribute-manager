<template>
  <md-menu md-size="big" md-direction="bottom-end" :md-active="menu" :md-close-on-click="false"
    :md-close-on-select="false" @md-closed="SeeOrHideMenu">

    <md-button class="md-icon-button md-menu-trigger" @click.stop="SeeOrHideMenu">
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