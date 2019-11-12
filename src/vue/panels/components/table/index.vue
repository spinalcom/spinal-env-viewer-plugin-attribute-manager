<template>
  <div class="_tableContent">

    <div class="buttonFab">
      <md-button v-if="!editMode"
                 @click="ActiveEditMode"
                 class="md-fab md-mini md-plain">
        <md-icon>edit</md-icon>
      </md-button>

      <md-button v-if="editMode"
                 @click="validateOrCancel(false)"
                 class="md-fab md-mini md-plain">
        <md-icon>clear</md-icon>
      </md-button>

      <md-button v-if="editMode"
                 @click="validateOrCancel(true)"
                 class="md-fab md-mini md-primary">
        <md-icon>done</md-icon>
      </md-button>
    </div>

    <md-toolbar class="mdToolbar"
                md-elevation="0">

      <md-field class="md-toolbar-start">
        <md-input placeholder="Search by name..."
                  v-model="searchByName"
                  @input="searchOnTable" />
      </md-field>

      <!-- <div class="md-toolbar-section-end"> -->
      <div class="md-toolbar-end">

        <md-field class="mdSelect">
          <label for="columns">Filter by Column</label>
          <md-select v-model="headerSelected"
                     name="columns"
                     id="columns"
                     multiple>
            <md-option v-for="(head,index) in tableContent.header"
                       :key="index"
                       :value="`${head.category} / ${head.label}`">
              {{`${head.category} / ${head.label}`}}
            </md-option>
          </md-select>
        </md-field>

        <create-attribute :show="showAttrTooltip"
                          @open='openCreateAttrTooltips'
                          :itemFiltered="itemsSelected"
                          @validate="createAttribute"></create-attribute>

        <!-- <div> -->
        <!-- <md-button class="md-icon-button"
                     title="filter list" md-menu-trigger>
            <md-icon>filter_list</md-icon>
          </md-button> -->

        <!-- <md-menu md-size="small">
            <md-button class="md-icon-button"
                       title="filter list"
                       md-menu-trigger>
              <md-icon>filter_list</md-icon>
            </md-button>

            <md-menu-content>
              <md-select>
                <md-option value="fight-club">Fight Club</md-option>
                <md-option value="godfather">Godfather</md-option>
                <md-option value="godfather-ii">Godfather II</md-option>
                <md-option value="godfather-iii">Godfather III</md-option>
                <md-option value="godfellas">Godfellas</md-option>
                <md-option value="pulp-fiction">Pulp Fiction</md-option>
                <md-option value="scarface">Scarface</md-option>
              </md-select>
            </md-menu-content>
          </md-menu> -->

        <!-- </div> -->
      </div>
    </md-toolbar>

    <md-table v-model="searched"
              class="md-scrollbar"
              @md-selected="onSelect">

      <md-table-empty-state md-label="No data found"
                            :md-description="`No data found `">

      </md-table-empty-state>

      <md-table-row slot="md-table-row"
                    slot-scope="{ item }"
                    md-selectable="multiple">
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Type">{{ item.type }}</md-table-cell>

        <md-table-cell v-for="(attribute,index) in headerDisplayed"
                       :key="index"
                       :md-label="`${attribute.category} / ${attribute.label}`">

          <table-content-component :editable="editMode"
                                   :item="item"
                                   :attribute="attribute"
                                   ref="editableComponent">
          </table-content-component>
        </md-table-cell>
      </md-table-row>

    </md-table>
  </div>
</template>

<script>
import TableContentComponent from "./tableContent.vue";
import CreateAttributeTooltips from "../tooltips/createAttribute.vue";

export default {
  name: "TableComponent",
  props: {
    tableContent: {}
  },
  components: {
    "table-content-component": TableContentComponent,
    "create-attribute": CreateAttributeTooltips
  },
  data() {
    return {
      showAttrTooltip: false,
      editMode: false,
      searched: [],
      header: [],
      searchByName: "",
      itemsSelected: [],
      headerSelected: [],
      headerDisplayed: []
    };
  },
  //   mounted() {
  //     this.searched = this.tableContent;
  //     console.log("created", this.searched);
  //   },
  methods: {
    validateOrCancel(valid) {
      let references = this.$refs["editableComponent"];

      if (valid) {
        references.forEach(compo => {
          compo.validateValue();
        });
      } else {
        references.forEach(compo => {
          compo.cancelValue();
        });
      }

      this.editMode = false;
    },
    ActiveEditMode() {
      this.editMode = true;
    },
    openCreateAttrTooltips() {
      this.showAttrTooltip = !this.showAttrTooltip;
    },
    createAttribute() {
      this.$emit("refresh");
    },

    filterByName(liste, name) {
      if (name.trim().length > 0) {
        return liste.filter(item => {
          return item.name.toLowerCase().includes(name.trim().toLowerCase());
        });
      }

      return liste;
    },

    searchOnTable() {
      this.searched = this.filterByName(
        this.tableContent.data,
        this.searchByName
      );
    },
    onSelect(items) {
      this.itemsSelected = items;
    }
  },
  watch: {
    tableContent() {
      this.header = this.tableContent.header;
      // let data = this.tableContent.data.map(el => {
      //   let info = {};
      //   info["id"] = el.id;
      //   info["name"] = el.name;
      //   info["type"] = el.type;

      //   this.header.forEach(element => {
      //     info[`${element.category}/${element.label}`] = element.value;
      //   });

      //   return info;
      // });

      // this.searched = data;

      this.headerSelected = this.tableContent.header.map(el => {
        return `${el.category} / ${el.label}`;
      });

      this.searched = this.filterByName(
        this.tableContent.data,
        this.searchByName
      );
    },
    headerSelected() {
      this.headerDisplayed = this.tableContent.header.filter(el => {
        let item = `${el.category} / ${el.label}`;
        return this.headerSelected.indexOf(item) !== -1;
      });
    }
  }
};
</script>

<style scoped>
._tableContent {
  width: 100%;
  height: 100%;
}

._tableContent .mdToolbar {
  width: 100%;
  height: 60px;
  padding: 0px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

._tableContent .mdToolbar .md-toolbar-start,
._tableContent .mdToolbar .md-toolbar-end {
  width: calc(45%) !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

._tableContent .mdToolbar .md-toolbar-end .mdSelect {
  width: 50%;
}

._tableContent .md-table {
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
}

.buttonFab {
  position: absolute;
  bottom: 30px;
  right: 20px;
}

._tableContent .md-table.md-theme-default .md-table-row td {
  min-width: 60px;
  max-width: 80px;
  /* text-align: center; */
}
</style>