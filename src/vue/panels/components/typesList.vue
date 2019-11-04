<template>
  <div v-if="types"
       class="_container">
    <div class="_containerItem"
         v-for="(type,index) in types"
         :key="index"
         @click="selectType(type)">
      {{type}}
    </div>
  </div>
</template>

<script>
export default {
  name: "typeLstComponent",
  props: {
    types: {
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    selectType(type) {
      this.$emit("select", type);
    }
  }
};
</script>

<style scoped>
._container {
  width: calc(100% - 40px);
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
}

._containerItem {
  width: 45%;
  height: 150px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

._containerItem:hover {
  background-color: gray;
  cursor: pointer;
}
</style>