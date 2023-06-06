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
  <div class="_tableContent" data-app>
    <div class="buttonFab">
      <fabs-component
        :editMode="editMode"
        :itemsSelected="itemsSelected"
        :headerDisplayed="headerDisplayed"
        @configure="OpenParamsDialog"
        @link="LinkItem"
        @edit="ActiveEditMode"
        @valid="validateOrCancel"
        @setToColumn="setValueToColumn"
        @generateGroup="generateGroup"
      ></fabs-component>
    </div>

    <div class="mdToolbar" md-elevation="0">
      <div class="toolbar-start">
        <standard-buttons
          :itemsSelected="itemsSelected"
          @refresh="refresh"
        ></standard-buttons>
      </div>

      <div class="toolbar-end">
        <div class="searchDiv">
          <!-- <md-radio v-model="searchBy"
                    class="md-primary"
                    :value="0">Search by name</md-radio>

          <md-radio v-model="searchBy"
                    class="md-primary"
                    :value="1">Search by value</md-radio> -->

          <md-field>
            <!-- <label for="searchBy">Search By</label> -->
            <md-select v-model="searchBy" name="searchBy" id="searchBy">
              <md-option :value="0">Search by name</md-option>
              <md-option :value="1">Search by value</md-option>
            </md-select>
          </md-field>
        </div>

        <md-field>
          <input
            class="md-input"
            placeholder="Search..."
            v-model="searchValue"
          />
          <md-icon>search</md-icon>
        </md-field>
      </div>
    </div>
    <!-- End First Toolbar -->

    <!-- :value="itemsSelected"
            :v-model="itemsSelected"  :custom-sort="sortByName"-->
    <div class="_tableContainer">
      <v-data-table
        :headers="headerDisplayed"
        :items="searched"
        :rows-per-page-items="rowsPerPageText"
        :pagination.sync="pagination"
        dark
        class="elevation-1"
      >
        <template v-slot:headers="props">
          <tr>
            <th style="text-align: left">
              <md-menu class="selectionMenu" md-size="small">
                <md-button md-menu-trigger>
                  <md-icon>menu</md-icon>
                  &nbsp; Select
                </md-button>

                <md-menu-content>
                  <md-menu-item
                    v-for="(m, index) in checkboxSelects"
                    :key="index"
                    @click="m.action"
                  >
                    <!-- <md-icon>{{
                      m.value ? 'check_box' : 'check_box_outline_blank'
                    }}</md-icon> -->
                    {{ m.text }}
                  </md-menu-item>
                </md-menu-content>
              </md-menu>
            </th>

            <th
              style="text-align: left"
              v-for="(head, index) in props.headers"
              :key="index"
            >
              {{ head.text }}
            </th>
            <th></th>
          </tr>
        </template>

        <template v-slot:items="props">
          <td>
            <v-checkbox
              v-model="props.item.selected"
              @change="checkItem(props.item)"
              primary
              hide-details
            ></v-checkbox>
          </td>
          <td class="nameCell" @click="selectItemInViewer(props.item)">
            <md-tooltip md-direction="top">{{ props.item.name }}</md-tooltip>
            {{ props.item.name }}
          </td>
          <td>{{ props.item.type }}</td>
          <td
            class="text-xs-center"
            v-for="(attribute, index) in header"
            :key="index"
          >
            <table-content-component
              :editable="editMode"
              :item="props.item"
              :attribute="attribute"
              :itemsMap="itemsMap"
              @setValue="refresh"
              @findValueInMaquette="findValueInMaquette"
              ref="editableComponent"
            >
            </table-content-component>
          </td>
          <td>
            <md-button
              class="md-icon-button"
              @click="openAttributesPanel(props.item)"
            >
              <md-tooltip>Open Properties Panel</md-tooltip>
              <md-icon>tune</md-icon>
            </md-button>
          </td>
        </template>
      </v-data-table>

      <!-- <div class="text-xs-center pt-2"> -->
      <!-- <div class="paginationDiv">
        <v-pagination v-model="pagination.page"
                      :length="pages"
                      :total-visible="5"
                      color="blue"></v-pagination>

        <div class="detail">
          Total items : {{searched.length}}
        </div>

      </div> -->
    </div>

    <!-- <div class="pageNumber"></div> -->
    <!-- </md-table> -->
  </div>
</template>

<script>
import TableContentComponent from './tableContent.vue';
import CreateAttributeTooltips from '../tooltips/createAttribute.vue';
// import ChangeColValue from "../tooltips/changeCol.vue";
import attributeService from '../../../../../services';

import StandardButtons from './standard-buttons.vue';
import FabsComponent from './fabs.vue';

import EventBus from '../../../../../js/events/events';
// import tableContentVue from "./tableContent.vue";
import {SpinalGraphService} from 'spinal-env-viewer-graph-service';

const {
  spinalPanelManagerService,
} = require('spinal-env-viewer-panel-manager-service');

const lodash = require('lodash');

import $ from 'jquery';

export default {
  name: 'TableComponent',
  props: {
    tableContent: {},
    header: {},
    typeSelected: {},
  },
  components: {
    'fabs-component': FabsComponent,
    'table-content-component': TableContentComponent,
    'create-attribute': CreateAttributeTooltips,
    // "change-col-value": ChangeColValue,
    'standard-buttons': StandardButtons,
  },
  data() {
    this.checkboxSelects = [
      {text: 'select All', value: true, action: this.selectAll},
      {
        text: 'select only the current page',
        value: true,
        action: this.selectOnLyTheCurrentPage,
      },
      // {text: 'deselect All', value: false, action: this.unSelectAll},
      // {
      //   text: 'select this page',
      //   value: true,
      //   action: this.selectCurrentPage,
      // },
      // {
      //   text: 'deselect select this page',
      //   value: false,
      //   action: this.unSelectCurrentPage,
      // },
    ];

    return {
      showAttrTooltip: false,
      editMode: false,
      searched: [],
      searchValue: '',
      searchBy: 0,

      itemsSelected: [],
      // selected: [],
      headerDisplayed: [],
      pagination: {
        page: 1,
        rowsPerPage: 20,
        totalItems: 0,
      },
      rowsPerPageText: [20, 30, 40],
      // buttons: [
      //   {
      //     icon: "settings_applications",
      //     text: "Configuration",
      //     action: this.OpenParamsDialog
      //   },
      //   {
      //     icon: "link",
      //     text: "Link to group",
      //     action: this.LinkItem
      //   },
      //   {
      //     icon: "edit",
      //     text: "Active edit mode",
      //     action: this.ActiveEditMode
      //   }
      // ],

      itemsMap: new Map(),
    };
  },

  created() {
    this.searchAndFilterTable = lodash.debounce(this.searchOnTable, 500);
  },

  mounted() {
    this.searched = this.sortByName(
      this.tableContent.map((el) => {
        el.selected = false;
        return el;
      })
    );
    setTimeout(() => {
      // this.itemsSelected = Object.assign([], this.searched);
      this._addPageNumber();
    }, 200);
  },

  methods: {
    async validateOrCancel(valid) {
      // let references = this.$refs["editableComponent"]
      //   ? this.$refs["editableComponent"]
      //   : [];

      // if (valid) {
      //   references.forEach(compo => {
      //     compo.validateValue();
      //   });
      // } else {
      //   references.forEach(compo => {
      //     compo.cancelValue();
      //   });
      // }

      if (valid) {
        await this._changeValue();
      }
      // else {
      //   await this._cancelValue();
      // }

      this.refresh();
      this.editMode = false;
    },

    ActiveEditMode() {
      this.editMode = true;
    },

    createAttribute() {
      this.$emit('refresh');
    },

    filterByName(liste, name) {
      if (name.trim().length > 0) {
        return liste
          .filter((item) => {
            return item.name.toLowerCase().includes(name.trim().toLowerCase());
          })
          .map((el) => {
            el.selected = false;
            return el;
          });
      }

      return liste.map((el) => {
        el.selected = false;
        return el;
      });
    },

    filterByValue(liste, value) {
      if (value.trim().length > 0) {
        return liste
          .filter((el) => {
            let found = el.attributes.find((attr) => {
              return attr.value
                .toString()
                .toLowerCase()
                .includes(value.trim().toLowerCase());
            });

            return found ? true : false;
          })
          .map((el) => {
            el.selected = false;
            return el;
          });
      }

      return liste.map((el) => {
        el.selected = false;
        return el;
      });
    },

    searchOnTable() {
      switch (this.searchBy) {
        case 0:
          this.searched = this.sortByName(
            this.filterByName(this.tableContent, this.searchValue)
          );
          break;

        case 1:
          this.searched = this.sortByName(
            this.filterByValue(this.tableContent, this.searchValue)
          );

          break;
      }

      // this.searched = this.filterByName(this.tableContent, this.searchValue);
    },

    // onSelect(items) {
    //    // this.itemsSelected = items;
    // },

    // addItemToList(itemsSelected, listes, add = true) {
    //    for (const item of listes) {
    //       const found = itemsSelected.find((el) => el.id === item.id);
    //       if (add && !found) {
    //          itemsSelected.push(item);
    //       } else if (!add && found) {
    //          itemsSelected = itemsSelected.filter((el) => el.id !== found.id);
    //       }
    //    }
    //    return itemsSelected;
    // },

    // allItemsIsSelected(liste) {
    //    for (const element of liste) {
    //       let found = this.itemsSelected.find((el) => el.id === element.id);
    //       if (typeof found === "undefined") return false;
    //    }

    //    return true;
    // },

    // selectItemInViewer(item) {
    //    attributeService.getBimObjects(item.id);
    // },

    selectAll(value) {
      this.searched = this.searched.map((el) => {
        el.selected = true;
        return el;
      });
      // if (value) {
      //    // if (this.itemsSelected.length === this.searched.length)
      //    //   this.itemsSelected = [];
      //    // else this.itemsSelected = this.searched;

      //    const allAreSelected = this.allItemsIsSelected(this.searched);
      //    this.itemsSelected = this.addItemToList(
      //       this.itemsSelected,
      //       this.searched,
      //       !allAreSelected
      //    );
      // } else {
      //    const pageNumber = this.pagination.page;
      //    const itemByPage = this.pagination.rowsPerPage;

      //    const begin = (pageNumber - 1) * itemByPage;
      //    const end = begin + itemByPage;

      //    const sortedList = Object.assign(
      //       [],
      //       this.sortByName(this.searched)
      //    );
      //    const pageItems = sortedList.slice(begin, end);
      //    const allItemsIsSelected = this.allItemsIsSelected(pageItems);

      //    for (const element of pageItems) {
      //       if (allItemsIsSelected) {
      //          this.itemsSelected = this.itemsSelected.filter(
      //             (el) => el.id !== element.id
      //          );
      //       } else {
      //          this.itemsSelected = [...this.itemsSelected, element];
      //       }
      //    }
      // }

      // console.log("itemsSelected", this.itemsSelected);
    },

    unSelectAll() {
      this.searched = this.searched.map((el) => {
        el.selected = false;
        return el;
      });
    },

    selectOnLyTheCurrentPage() {
      this.unSelectAll();
      this.selectCurrentPage();
    },

    selectCurrentPage() {
      const pageNumber = this.pagination.page;
      const itemByPage = this.pagination.rowsPerPage;

      const begin = (pageNumber - 1) * itemByPage;
      const end = begin + itemByPage;

      // for (let i = begin; i < end; i++) {
      //    this.searched[i].selected = true;
      // }
      this.searched = this.searched.map((el, index) => {
        // console.log("index", index);
        if (index >= begin && index < end) {
          el.selected = true;
        }
        return el;
      });
    },

    unSelectCurrentPage() {
      const pageNumber = this.pagination.page;
      const itemByPage = this.pagination.rowsPerPage;

      const begin = (pageNumber - 1) * itemByPage;
      const end = begin + itemByPage;

      // for (let i = begin; i < end; i++) {
      //    this.searched[i].selected = false;
      // }
      this.searched = this.searched.map((el, index) => {
        if (index >= begin && index < end) {
          el.selected = false;
        }
        return el;
      });
    },

    refresh() {
      this.$emit('refresh');

      // let item = this.tableContent.find(el => el.id === argData.item.id);

      // let found;
      // if (item && argData.attribute) {
      //   found = item.attributes.find(el => {
      //     return (
      //       el.label === argData.attribute.label &&
      //       el.category === argData.attribute.category
      //     );
      //   });
      // }
      // if (typeof found !== "undefined") {
      //   found.value = argData.value;
      // }
    },

    setValueToColumn(res) {
      let value = res.value;
      let category = res.column.split('/')[0];
      let label = res.column.split('/')[1];

      if (res.pageOnly) {
        let references = this.$refs['editableComponent'];

        references.forEach((el) => {
          if (res.useMaquetteValue) {
            this.findValueInMaquette(
              {
                id: el.item.id,
                category: category,
                attribute: label,
              },
              false
            );
          } else {
            el.setValueToColumn(category, label, value);
          }
        });
      } else {
        for (const id of this.itemsMap.keys()) {
          if (res.useMaquetteValue) {
            this.findValueInMaquette(
              {
                id: id,
                category: category,
                attribute: label,
              },
              false
            );
          } else {
            this.setValue(id, category, label, value);
          }
        }
      }
    },

    LinkItem() {
      // console.log(this.itemsSelected, this.searched);
      if (this.itemsSelected.length === 0)
        return alert('you must select at less one item');
      spinalPanelManagerService.openPanel('linkToGroupDialog', {
        type: this.typeSelected,
        itemSelected: this.itemsSelected,
      });
    },

    generateGroup() {
      // console.log(this.itemsSelected, this.searched);

      //  const itemsFiltered = this._filterElementSelected(this.searched);
      if (this.itemsSelected.length === 0) {
        window.alert('select at less one item');
        return;
      }
      //  if (itemsFiltered.length === 0) {
      //     window.alert("select at less one item");
      //     return;
      //  }
      spinalPanelManagerService.openPanel('generateGroupPanel', {
        type: this.typeSelected,
        // items: itemsFiltered,
        items: this.itemsSelected,
      });
    },

    OpenParamsDialog() {
      // spinalPanelManagerService.openPanel("paramDialogComponent", {
      //   tableContent: this.tableContent,
      //   header: this.header,
      //   typeSelected: this.typeSelected,
      //   callback: () => {
      //     this.$emit("refresh");
      //   }
      // });

      spinalPanelManagerService.openPanel('configurationPanel', {
        callback: () => {
          this.$emit('refresh');
        },
      });
    },

    sortByName(items) {
      return items.sort((a, b) => {
        const name1 = a.name.toUpperCase();
        const name2 = b.name.toUpperCase();

        let comparison = 0;
        if (name1 > name2) {
          comparison = 1;
        } else if (name1 < name2) {
          comparison = -1;
        }
        return comparison;
      });
    },

    selectItemInViewer(item) {
      EventBus.$emit('selectElement', item);
    },

    constructMap() {
      for (const content of this.tableContent) {
        const element = {};
        for (const attr of content.attributes) {
          element[`${attr.category}_${attr.label}`] = {
            value: attr.value,
            displayValue: attr.value,
          };
        }
        this.itemsMap.set(content.id, element);
      }
    },

    async findValueInMaquette(res, alert = true) {
      const node = SpinalGraphService.getInfo(res.id);

      const value = await attributeService.getBimObjectAttribute(
        node.get(),
        res.attribute
      );

      if (value === '-') {
        if (alert) window.alert('no value found !');
        return;
      } else {
        this.setValue(res.id, res.category, res.attribute, value);
      }
    },

    openAttributesPanel(item) {
      let info = SpinalGraphService.getInfo(item.id);

      const viewer = window.spinal.ForgeViewer.viewer;
      let propertyPanel = viewer.getPropertyPanel();

      if (typeof propertyPanel === 'undefined') {
        propertyPanel =
          new Autodesk.Viewing.Extensions.ViewerPropertyPanel.prototype.constructor(
            viewer
          );
        viewer.setPropertyPanel(propertyPanel);
      }

      const model = window.spinal.BimObjectService.getModelByBimfile(
        info.bimFileId.get()
      );

      propertyPanel.currentModel = model;

      propertyPanel.setVisible(true);
      propertyPanel.setNodeProperties(info.dbid.get());
    },

    openCreateAttrTooltips() {
      this.showAttrTooltip = !this.showAttrTooltip;
    },

    setValue(id, category, attribute, value = '-') {
      const obj = this.itemsMap.get(id);
      obj[`${category}_${attribute}`]['displayValue'] = value;
    },

    async _changeValue() {
      const promises = [];

      for (const nodeId of this.itemsMap.keys()) {
        const found = this.tableContent.find((el) => el.id === nodeId);

        if (found && found.attributes) {
          for (const attr of found.attributes) {
            let value =
              this.itemsMap.get(nodeId)[`${attr.category}_${attr.label}`][
                'value'
              ];
            let displayValue =
              this.itemsMap.get(nodeId)[`${attr.category}_${attr.label}`][
                'displayValue'
              ];

            if (value !== displayValue) {
              promises.push(
                attributeService.updateAttributeValue(
                  nodeId,
                  attr.category,
                  attr.label,
                  displayValue
                )
              );
              // .then(() => {
              //   this.itemsMap.get(nodeId)[`${attr.category}_${attr.label}`][
              //     "value"
              //   ] = this.itemsMap.get(nodeId)[
              //     `${attr.category}_${attr.label}`
              //   ]["displayValue"];
              // });
            }
          }
        }

        // obj[`${category}_${label}`]["displayValue"] = value;
      }

      return Promise.all(promises);
    },

    async _cancelValue() {
      for (const nodeId of this.itemsMap.keys()) {
        const found = this.tableContent.find((el) => el.id === nodeId);

        if (found && found.attributes) {
          for (const attr of found.attributes) {
            this.itemsMap.get(nodeId)[`${attr.category}_${attr.label}`][
              'displayValue'
            ] =
              this.itemsMap.get(nodeId)[`${attr.category}_${attr.label}`][
                'value'
              ];
          }
        }
      }

      return;
    },

    _addPageNumber() {
      const actionDiv = $(
        '._tableContent .theme--dark.v-datatable .v-datatable__actions .v-datatable__actions__range-controls'
      )[0];

      const div = $(
        `<div class="v-datatable__actions__page-number">Page : ${this.pagination.page} / ${this.pages}</div>`
      );

      actionDiv.before(div[0]);
    },

    _filterElementSelected(liste) {
      if (this.searchValue.trim().length > 0) {
        return liste.filter((item) => {
          const found = this.itemsSelected.find((el) => el.id === item.id);
          return found;
        });
      }
      return liste;
    },

    checkItem(item) {
      // const found = this.searched.find((el) => el.id === item.id);
      // if (found) {
      //    console.log("found", found);
      //    found.selected = item.selected;
      // }
      // if (item) {
      //    this.searched = this.searched.map((el) => {
      //       if (el.id === item.id) {
      //          console.log("el found", el);
      //          el.selected = !el.selected;
      //       }
      //       return el;
      //    });

      //    console.log(this.searched);
      // }

      this.itemsSelected = this.searched.filter((el) => el.selected);
    },
  },
  computed: {
    pages() {
      return Math.ceil(this.searched.length / this.pagination.rowsPerPage);
    },

    searchDataBind() {
      return `${this.searchValue}|${this.searchBy}`;
    },

    // itemsSelected() {
    //    return this.searched.filter((el) => el.selected);
    // },
  },
  watch: {
    searched() {
      this.itemsSelected = this.searched.filter((el) => el.selected);
    },
    async tableContent() {
      this.constructMap();
      this.searched = this.sortByName(
        this.filterByName(this.tableContent, this.searchValue)
      );
      this.pagination.totalItems = this.searched.length;
    },

    header() {
      let formated = this.header.map((el) => {
        let val = Object.assign({}, el);

        val['text'] = `${el.category} / ${el.label}`;
        val['value'] = `${el.category}_${el.label}`;

        return val;
      });

      this.headerDisplayed = [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Type',
          value: 'type',
        },
        ...formated,
      ];
    },

    /////////////////////////////
    //   if pagination change  //
    /////////////////////////////
    pagination() {
      const div = $('.v-datatable__actions__page-number')[0];
      if (div) div.innerHTML = `Page : ${this.pagination.page} / ${this.pages}`;
    },

    /////////////////////////////
    //  if search data change  //
    /////////////////////////////
    searchDataBind() {
      this.searchAndFilterTable();
    },

    // searchValue() {
    //    this.searchAndFilterTable();
    // },

    // searchBy() {
    //    this.searchAndFilterTable();
    // },

    // itemsSelected() {
    //   this.selected = Object.assign([], this.itemsSelected);
    // }
  },
};
</script>

<style scoped>
._tableContent {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

._tableContent .mdToolbar {
  width: 100%;
  height: 100px;
  padding: 0px;
  margin-bottom: 10px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

._tableContent .mdToolbar .toolbar-start {
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border-right: 1px dashed grey; */
}

._tableContent .mdToolbar .toolbar-end {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* align-items: center; */
  /* justify-content: flex-end; */
}

._tableContent .mdToolbar .toolbar-end .searchDiv {
  display: flex;
}

._tableContent .md-content.md-theme-default {
  background: transparent !important;
}

/* ._tableContent .secondMdToolbar {
  width: 100%;
  height: 50px;
  padding: 0px !important;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
} */

._tableContent ._tableContainer {
  width: 100%;
  height: calc(100% - 118px);
}

._tableContent ._tableContainer .nameCell {
  padding: 0px;
  white-space: nowrap;
  overflow: hidden;
  max-width: 200px;
  text-overflow: ellipsis;
}

._tableContent ._tableContainer .paginationDiv {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ._tableContent ._tableContainer .paginationDiv > * { */
/* width: 30%; */
/* } */

._tableContent ._tableContainer .paginationDiv .detail {
  display: flex;
  align-items: center;
  font-size: 15px;
}

.buttonFab {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

/* .buttonFab > * {
  justify-content: center;
  align-items: flex-end;
} */

/* .buttonFab .editModeBtn {
  display: flex;
  flex-direction: row;
} */

/* .secondToolbar .md-toolbar-end {
  display: flex;
  justify-content: flex-end !important;
} */

/* .elevation-1 {
  height: calc(100% - 50px);
  overflow: auto;
} */

/* ._tableContent .pageNumber {
  width: 100%;
  height: 50px;
  background-color: blue;
} */
</style>

<style>
._tableContent ._tableContainer .elevation-1 {
  width: 100%;
  height: 100%;
}

._tableContent ._tableContainer .elevation-1 .v-table__overflow {
  height: calc(100% - 63px);
  overflow-y: auto;
}

._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow
  .theme--dark.v-table {
  background-color: transparent;
}

.selectionMenu .md-button .md-ripple,
._tableContent .mdToolbar .md-ripple,
._tableContent ._tableContainer .md-ripple {
  padding: 0px;
}

._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow::-webkit-scrollbar {
  background-color: #fff;
  width: 10px;
}

/* background of the scrollbar except button or resizer */
._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow::-webkit-scrollbar-track {
  /* background-color: #fff; */
  background-color: #424242;
}

/* scrollbar itself */
._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow::-webkit-scrollbar-thumb {
  background-color: #babac0;
  border-radius: 16px;
  /* border: 5px solid #fff; */
}

/* set button(top and bottom of the scrollbar) */
._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow::-webkit-scrollbar-button {
  display: none;
}

.mdSpeedDialBtn .md-button .md-ripple {
  width: 170px;
  display: flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  /* color: #448aff; */
}

._tableContent .mdToolbar .toolbar-end .md-field {
  min-height: unset;
  padding: 0px;
  margin: 0px;
}

._tableContent .mdToolbar .toolbar-end .searchDiv .md-radio:not(.md-disabled),
.md-radio:not(.md-disabled) .md-radio-label {
  white-space: nowrap;
}

._tableContent .theme--dark.v-table,
._tableContent .theme--dark.v-datatable .v-datatable__actions {
  background-color: transparent;
}

._tableContent .theme--dark.v-datatable .v-datatable__actions {
  width: 90%;
  justify-content: space-between;
  /* background-color: crimson; */
}

._tableContent
  .theme--dark.v-datatable
  .v-datatable__actions
  .v-datatable__actions__select {
  width: 30%;
  justify-content: center;
}

._tableContent
  .theme--dark.v-datatable
  .v-datatable__actions
  .v-datatable__actions__page-number {
  /* width: 40px;
  height: 100%;
  text-align: center;
  background-color: #448aff;
  font-size: 1.5em;
  font-weight: bold; */

  width: 100px;
  height: 50px;
  /* font-size: 1.5em; */
  /* font-weight: bold; */
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid;
  border-radius: 50%; */
}

._tableContent
  .v-menu__content.theme--dark.v-menu__content--auto.menuable__content__active {
  position: fixed;
}

._tableContent ._tableContainer .selectionMenu .md-list-item-content {
  justify-content: unset;
}
</style>
