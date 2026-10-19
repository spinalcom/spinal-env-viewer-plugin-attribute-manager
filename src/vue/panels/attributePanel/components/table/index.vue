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
      <fabs-component :editMode="editMode" :itemsSelected="itemsSelected" :headerDisplayed="headerDisplayed"
        @configure="OpenParamsDialog" @link="LinkItem" @edit="ActiveEditMode" @valid="validateOrCancel"
        @setToColumn="setValueToColumn" @generateGroup="generateGroup"></fabs-component>
    </div>

    <div class="mdToolbar" md-elevation="0">
      <div class="toolbar-start">
        <standard-buttons :itemsSelected="itemsSelected" @refresh="refresh"></standard-buttons>
      </div>

      <div class="toolbar-end">
        <div class="searchDiv">

          <md-field>
            <md-select v-model="searchBy" name="searchBy" id="searchBy">
              <md-option :value="0">Search by name</md-option>
              <md-option :value="1">Search by value</md-option>
            </md-select>
          </md-field>

          <md-field v-if="searchBy === 1" class="columnField">
            <md-select v-model="searchColumn" name="searchColumn" id="searchColumn">
              <md-option value="all">All columns</md-option>
              <md-option v-for="head in header" :key="`${head.category}_${head.label}`"
                :value="`${head.category}_${head.label}`">
                {{ head.category }} / {{ head.label }}
              </md-option>
            </md-select>
          </md-field>

          <md-checkbox v-model="useRegex" class="md-primary">Regex</md-checkbox>
        </div>

        <md-field :class="{ 'md-invalid': regexError }">
          <input class="md-input" :placeholder="useRegex ? 'Search (regex)...' : 'Search...'" v-model="searchValue" />
          <md-icon>search</md-icon>
          <span class="md-error">{{ regexError }}</span>
        </md-field>
      </div>
    </div>
    <!-- End First Toolbar -->

    <div class="_tableContainer">
      <v-data-table :headers="headerDisplayed" :items="searched" :rows-per-page-items="rowsPerPageText"
        :pagination.sync="pagination" dark class="elevation-1">
        <template v-slot:headers="props">
          <tr>
            <th style="text-align: left">
              <md-menu class="selectionMenu" md-size="small">
                <md-button md-menu-trigger>
                  <md-icon>menu</md-icon>
                  &nbsp; Select<span v-if="itemsSelected.length > 0">&nbsp;({{ itemsSelected.length }})</span>
                </md-button>

                <md-menu-content>
                  <md-menu-item v-for="(m, index) in checkboxSelects" :key="index" @click="m.action">
                    {{ m.text }}
                  </md-menu-item>
                </md-menu-content>
              </md-menu>
            </th>

            <th style="text-align: left" v-for="(head, index) in props.headers" :key="index">
              {{ head.text }}
            </th>
            <th></th>
          </tr>
        </template>

        <template v-slot:items="props">
          <td>
            <v-checkbox v-model="props.item.selected" @change="checkItem(props.item)" primary hide-details></v-checkbox>
          </td>
          <td class="nameCell">
            <div class="nameCellContent">
              <span class="nameText" @click="selectItemInViewer(props.item)">
                <md-tooltip md-direction="top">{{ props.item.name }}</md-tooltip>
                {{ props.item.name }}
              </span>
              <md-button class="copyBtn md-icon-button md-dense" @click.stop="copy(props.item.name)">
                <md-tooltip>Copy name</md-tooltip>
                <md-icon>content_copy</md-icon>
              </md-button>
            </div>
          </td>
          <td class="copyable" @click="copy(props.item.type)">{{ props.item.type }}</td>
          <td class="text-xs-center" v-for="(attribute, index) in header" :key="index">
            <table-content-component :editable="editMode" :item="props.item" :attribute="attribute" :itemsMap="itemsMap"
              @setValue="refresh" @findValueInMaquette="findValueInMaquette" @copy="copy" ref="editableComponent">
            </table-content-component>
          </td>
          <td>
            <md-button class="md-icon-button" @click="openAttributesPanel(props.item)">
              <md-tooltip>Open Properties Panel</md-tooltip>
              <md-icon>tune</md-icon>
            </md-button>
          </td>
        </template>
      </v-data-table>

    </div>

    <md-snackbar md-position="center" :md-duration="1500" :md-active.sync="snackbar.show" md-persistent>
      {{ snackbar.message }}
    </md-snackbar>
  </div>
</template>

<script>
import TableContentComponent from './tableContent.vue';
import CreateAttributeTooltips from '../tooltips/createAttribute.vue';
import attributeService from '../../../../../services';

import StandardButtons from './standard-buttons.vue';
import FabsComponent from './fabs.vue';

import EventBus from '../../../../../js/events/events';
import { copyToClipboard } from '../../../../../js/utils/clipboard';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';

const { spinalPanelManagerService } = require('spinal-env-viewer-panel-manager-service');

const debounce = require('lodash.debounce');
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
    'standard-buttons': StandardButtons,
  },
  data() {
    this.checkboxSelects = [
      { text: 'select All', value: true, action: this.selectAll },
      { text: 'select only the current page', value: true, action: this.selectOnLyTheCurrentPage },
      { text: 'unselect All', value: false, action: this.unSelectAll },
      { text: 'unselect the current page', value: false, action: this.unSelectCurrentPage },
    ];

    return {
      showAttrTooltip: false,
      editMode: false,
      searched: [],
      searchValue: '',
      searchBy: 0,
      searchColumn: 'all',
      useRegex: false,
      regexError: '',

      itemsSelected: [],
      headerDisplayed: [],
      pagination: {
        page: 1,
        rowsPerPage: 20,
        totalItems: 0,
      },
      rowsPerPageText: [20, 30, 40],

      itemsMap: new Map(),
      snackbar: { show: false, message: '' },
    };
  },

  created() {
    this.searchAndFilterTable = debounce(() => {
      this.searchOnTable();
      this._goToFirstPage();
    }, 500);
  },

  mounted() {
    this.searchOnTable();

    setTimeout(() => {
      this._addPageNumber();
    }, 200);
  },

  methods: {
    // make "selected" reactive on new items, without resetting the selection
    _initSelected(liste) {
      for (const el of liste) {
        if (typeof el.selected === 'undefined') this.$set(el, 'selected', false);
      }
      return liste;
    },

    async validateOrCancel(valid) {
      if (valid) {
        await this._changeValue();
      }
      this.refresh();
      this.editMode = false;
    },

    ActiveEditMode() {
      this.editMode = true;
    },

    createAttribute() {
      this.$emit('refresh');
    },

    // Returns a predicate testing a string against the search, either as a
    // case-insensitive substring or as a case-insensitive regex.
    // Throws a SyntaxError if the regex is invalid.
    _getMatcher(search) {
      if (this.useRegex) {
        const regex = new RegExp(search, 'i');
        return (str) => regex.test(str);
      }

      const value = search.trim().toLowerCase();
      return (str) => str.toLowerCase().includes(value);
    },

    filterByName(liste, name) {
      if (name.trim().length === 0) return liste;

      const match = this._getMatcher(name);
      return liste.filter((item) => match(item.name));
    },

    filterByValue(liste, value) {
      if (value.trim().length === 0) return liste;

      const match = this._getMatcher(value);
      const column = this.searchColumn;

      return liste.filter((item) => item.attributes.some((attr) => {
        if (column !== 'all' && `${attr.category}_${attr.label}` !== column) return false;
        return match(String(attr.value));
      }));
    },

    searchOnTable() {
      const filter = this.searchBy === 1 ? this.filterByValue : this.filterByName;

      try {
        const filtered = filter(this._initSelected(this.tableContent), this.searchValue);
        this.regexError = '';
        this.searched = this.sortByName(filtered);
      } catch (error) {
        // invalid regex: keep the previous results and show the error
        if (!(error instanceof SyntaxError)) throw error;
        this.regexError = 'Invalid regex';
      }
    },

    selectAll(value) {
      this.searched = this.searched.map((el) => {
        el.selected = true;
        return el;
      });
    },

    // also unselect the rows hidden by the current search
    unSelectAll() {
      for (const el of this.tableContent) el.selected = false;
      this.searched = [...this.searched];
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

      this.searched = this.searched.map((el, index) => {
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

      this.searched = this.searched.map((el, index) => {
        if (index >= begin && index < end) {
          el.selected = false;
        }
        return el;
      });
    },

    refresh() {
      this.$emit('refresh');
    },

    _getIds(pageShowed) {
      if (pageShowed) {
        const l = this.$refs['editableComponent'] || [];
        return l.map((el) => el.item.id);
      }

      return Array.from(this.itemsMap.keys());
    },

    setValueToColumn(res) {
      let [category, attribute] = res.column.split('/');

      const ids = this._getIds(res.pageOnly);

      const promises = ids.map((id) => {
        try {
          if (res.useMaquetteValue) {
            const attr = { id, category, attribute };
            return this.findValueInMaquette(attr, false);
          }

          const success = this.setValue(id, category, attribute, res.value);
          Promise.resolve(success);
        } catch (error) {
          console.error(error);
          return false;
        }

      });

      return Promise.all(promises);

      // for (const ids of list) {
      //   if (res.useMaquetteValue) {
      //     const id = res.pageOnly ? i.item.id : i;
      //     const attr = { id: id, category: category, attribute: label };
      //     this.findValueInMaquette(attr, false);
      //   } else {
      //     i.setValueToColumn(category, label, value);
      //   }
      // }
    },

    LinkItem() {
      if (this.itemsSelected.length === 0)
        return alert('you must select at less one item');

      spinalPanelManagerService.openPanel('linkToGroupDialog', {
        type: this.typeSelected,
        itemSelected: this.itemsSelected,
      });
    },

    generateGroup() {

      if (this.itemsSelected.length === 0) {
        window.alert('select at less one item');
        return;
      }

      spinalPanelManagerService.openPanel('generateGroupPanel', {
        type: this.typeSelected,
        items: this.itemsSelected,
      });
    },

    OpenParamsDialog() {
      spinalPanelManagerService.openPanel('configurationPanel', {
        callback: () => {
          this.$emit('refresh');
        },
      });
    },

    sortByName(items) {
      return [...items].sort((a, b) => {
        const name1 = a.name.toUpperCase();
        const name2 = b.name.toUpperCase();

        let comparison = 0;
        if (name1 > name2) comparison = 1;
        else if (name1 < name2) comparison = -1;

        return comparison;
      });
    },

    async copy(text) {
      if (window.getSelection().toString().length > 0) return;

      try {
        await copyToClipboard(text);
        this.snackbar.message = `Copied "${text}"`;
      } catch (error) {
        console.error(error);
        this.snackbar.message = 'Unable to copy to clipboard';
      }
      this.snackbar.show = true;
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

      const value = await attributeService.getBimObjectAttribute(node.get(), res.attribute);

      if (value === '-') {
        if (alert) window.alert('no value found !');
        return false;
      }

      return this.setValue(res.id, res.category, res.attribute, value);
    },

    openAttributesPanel(item) {
      let info = SpinalGraphService.getInfo(item.id);

      if (!info.bimFileId) {
        return alert('This object has no bimFileId');
      }

      const viewer = window.spinal.ForgeViewer.viewer;
      let propertyPanel = viewer.getPropertyPanel();

      if (!propertyPanel) {
        propertyPanel = new Autodesk.Viewing.Extensions.ViewerPropertyPanel.prototype.constructor(viewer);
        viewer.setPropertyPanel(propertyPanel);
      }

      const model = window.spinal.BimObjectService.getModelByBimfile(info.bimFileId.get());
      propertyPanel.currentModel = model;

      propertyPanel.setVisible(true);
      propertyPanel.setNodeProperties(info.dbid.get());
    },

    openCreateAttrTooltips() {
      this.showAttrTooltip = !this.showAttrTooltip;
    },

    setValue(id, category, attribute, value = '-') {
      try {
        const obj = this.itemsMap.get(id);
        obj[`${category}_${attribute}`]['displayValue'] = value;
        return true;
      } catch (error) {
        return false;
      }

    },

    async _updateValue(obj, nodeId) {
      const found = obj[nodeId];

      if (!found || !found.attributes) return;

      const categoriesObj = convertToObjAndClassifyByCategory.call(this, found.attributes, nodeId);

      const promises = Object.keys(categoriesObj).map((category) => {
        const attributes = categoriesObj[category];
        return attributeService.updateSeveralAttributes(nodeId, category, attributes);
      });

      return Promise.all(promises);

      function convertToObjAndClassifyByCategory(attributes, id) {
        return attributes.reduce((o, el) => {
          const key = `${el.category}_${el.label}`;
          const mapItem = this.itemsMap.get(id);
          const value = mapItem[key]['value'];
          const displayValue = mapItem[key]['displayValue'];

          if (value !== displayValue) {
            if (!o[el.category]) o[el.category] = [];
            o[el.category].push({ label: el.label, value: displayValue });
          }

          return o;

        }, {});
      }
    },

    async _changeValue() {
      const obj = this._convertTableContentToObj();
      const nodeIds = Array.from(this.itemsMap.keys());

      const promises = nodeIds.map(async (nodeId) => this._updateValue(obj, nodeId));

      return Promise.all(promises);
    },

    async _cancelValue() {
      const obj = this._convertTableContentToObj();
      for (const nodeId of this.itemsMap.keys()) {
        const found = obj[nodeId];
        if (!found || !found.attributes) continue;

        for (const attr of found.attributes) {
          const key = `${attr.category}_${attr.label}`;
          const mapItem = this.itemsMap.get(nodeId);

          mapItem[key]['displayValue'] = mapItem[key]['value'];
        }

      }
    },

    _convertTableContentToObj() {
      return this.tableContent.reduce((list, el) => {
        list[el.id] = el;
        return list;
      }, {});
    },

    _addPageNumber() {
      const actionDiv = $('._tableContent .theme--dark.v-datatable .v-datatable__actions .v-datatable__actions__range-controls')[0];
      const div = $(`<div class="v-datatable__actions__page-number">Page : ${this.pagination.page} / ${this.pages}</div>`);

      actionDiv.before(div[0]);
    },

    _updatePageNumber() {
      const div = $('.v-datatable__actions__page-number')[0];
      if (div) div.innerHTML = `Page : ${this.pagination.page} / ${this.pages}`;
    },

    _goToFirstPage() {
      if (this.pagination.page !== 1) this.pagination = Object.assign({}, this.pagination, { page: 1 });
    },

    _filterElementSelected(liste) {
      if (this.searchValue.trim().length === 0) return liste;

      return liste.filter((item) => {
        const found = this.itemsSelected.find((el) => el.id === item.id);
        return found;
      });
    },

    checkItem(item) {
      this.itemsSelected = this.searched.filter((el) => el.selected);
    },
  },
  computed: {
    pages() {
      return Math.ceil(this.searched.length / this.pagination.rowsPerPage);
    },

    searchDataBind() {
      return `${this.searchValue}|${this.searchBy}|${this.searchColumn}|${this.useRegex}`;
    },
  },
  watch: {
    searched() {
      this.itemsSelected = this.searched.filter((el) => el.selected);
    },

    async tableContent() {
      this.constructMap();

      this.searchOnTable();

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
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        ...formated,
      ];

      // the column used by the value search is no longer displayed
      if (!formated.some((el) => el.value === this.searchColumn)) this.searchColumn = 'all';
    },

    pagination() {
      this._updatePageNumber();
    },

    pages() {
      this._updatePageNumber();
    },

    searchDataBind() {
      this.searchAndFilterTable();
    },
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
}

._tableContent .mdToolbar .toolbar-end {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

._tableContent .mdToolbar .toolbar-end .searchDiv {
  display: flex;
  align-items: center;
}

._tableContent .mdToolbar .toolbar-end .searchDiv .md-checkbox {
  margin: 0 0 0 16px;
  white-space: nowrap;
}

._tableContent .md-content.md-theme-default {
  background: transparent !important;
}

._tableContent ._tableContainer {
  width: 100%;
  height: calc(100% - 118px);
}

._tableContent ._tableContainer .nameCell {
  padding: 0px;
  max-width: 200px;
}

._tableContent ._tableContainer .nameCellContent {
  display: flex;
  align-items: center;
}

._tableContent ._tableContainer .nameText {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

._tableContent ._tableContainer .copyBtn {
  visibility: hidden;
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin: 0px;
}

._tableContent ._tableContainer .nameCell:hover .copyBtn {
  visibility: visible;
}

._tableContent ._tableContainer .copyable {
  cursor: copy;
}

._tableContent ._tableContainer .paginationDiv {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

._tableContent ._tableContainer .paginationDiv .detail {
  display: flex;
  align-items: center;
  font-size: 15px;
}

/* the closed speed dial keeps its (invisible) layout box, which would
   otherwise catch the clicks on the table under it */
.buttonFab {
  position: absolute;
  bottom: 20px;
  right: 20px;
  pointer-events: none;
}

._tableContent .mdToolbar .toolbar-end .searchDiv .columnField {
  margin-left: 16px;
}
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

._tableContent ._tableContainer .elevation-1 .v-table__overflow .theme--dark.v-table {
  background-color: transparent;
}

.selectionMenu .md-button .md-ripple,
._tableContent .mdToolbar .md-ripple,
._tableContent ._tableContainer .md-ripple {
  padding: 0px;
}

._tableContent ._tableContainer .elevation-1 .v-table__overflow::-webkit-scrollbar {
  background-color: #fff;
  width: 10px;
}

/* background of the scrollbar except button or resizer */
._tableContent ._tableContainer .elevation-1 .v-table__overflow::-webkit-scrollbar-track {
  /* background-color: #fff; */
  background-color: #424242;
}

/* scrollbar itself */
._tableContent ._tableContainer .elevation-1 .v-table__overflow::-webkit-scrollbar-thumb {
  background-color: #babac0;
  border-radius: 16px;
  /* border: 5px solid #fff; */
}

/* set button(top and bottom of the scrollbar) */
._tableContent ._tableContainer .elevation-1 .v-table__overflow::-webkit-scrollbar-button {
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

._tableContent .theme--dark.v-datatable .v-datatable__actions .v-datatable__actions__select {
  width: 30%;
  justify-content: center;
}

._tableContent .theme--dark.v-datatable .v-datatable__actions .v-datatable__actions__page-number {
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

._tableContent .v-menu__content.theme--dark.v-menu__content--auto.menuable__content__active {
  position: fixed;
}

._tableContent ._tableContainer .selectionMenu .md-list-item-content {
  justify-content: unset;
}
</style>
