<template>
  <md-dialog class="mdDialogContainer"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title>Link To Group</md-dialog-title>
    <md-dialog-content>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-85">
          <md-field>
            <label for="context">Select Context</label>
            <md-select v-model="contextSelected"
                       name="context"
                       id="context"
                       md-dense>
              <md-option v-for="(context,index) in data"
                         :key="index"
                         :value="context.id">{{context.name}}
              </md-option>

            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-10 mdIcon">
          <md-button class="md-icon-button"
                     @click="createContext">
            <md-icon>control_point</md-icon>
          </md-button>
        </div>

      </div>

      <div class="md-layout md-gutter"
           v-if="contextSelected">
        <div class="md-layout-item md-size-85">
          <md-field>
            <label for="category">Select Category</label>
            <md-select v-model="categorySelected"
                       name="category"
                       id="category"
                       md-dense>
              <md-option :value="undefined"
                         disabled>None</md-option>

              <md-option v-for="(category,index) in categories"
                         :key="index"
                         :value="category.id">{{category.name}}
              </md-option>

            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-10 mdIcon">
          <md-button class="md-icon-button"
                     @click="createCategory">
            <md-icon>control_point</md-icon>
          </md-button>
        </div>

      </div>

      <div class="md-layout md-gutter"
           v-if="contextSelected && categorySelected">
        <div class="md-layout-item md-size-85">
          <md-field>
            <label for="group">Select Group</label>
            <md-select v-model="groupSelected"
                       name="group"
                       id="group"
                       md-dense>
              <md-option :value="undefined"
                         disabled>None</md-option>

              <md-option v-for="(group,index) in groups"
                         :key="index"
                         :value="group.id">{{group.name}}
              </md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-10 mdIcon">
          <md-button class="md-icon-button"
                     @click="createGroup">
            <md-icon>control_point</md-icon>
          </md-button>
        </div>

      </div>

    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 :disabled="disabled()"
                 @click="closeDialog(true)">Save</md-button>
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
import attributeService from "../../services/index";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import EventBus from "spinal-env-viewer-room-manager/js/event";

export default {
  name: "dialogComponent",
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      data: [],
      groups: [],
      categories: [],
      contextSelected: undefined,
      categorySelected: undefined,
      groupSelected: undefined,
      items: []
    };
  },
  created() {
    this.getAllData();
    EventBus.$on("itemCreated", () => {
      this.getAllData();
    });
  },
  methods: {
    opened(option) {
      this.items = option.itemSelected;
      console.log("this.items", this.items);
    },
    removed(option) {
      if (option) {
        this.items.forEach(el => {
          attributeService.linkItem(
            this.contextSelected,
            this.groupSelected,
            el.id
          );
        });
      }
      this.showDialog = false;
    },
    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    getAllData() {
      attributeService.getAllGroupContext().then(res => {
        this.data = res;
        this.updateCategory();
        this.updateGroups();
      });
    },
    // getCategories() {
    //   this.categorySelected = undefined;

    //   if (this.contextSelected) {
    //     let val = this.data.find(el => el.id === this.contextSelected);
    //     if (val) return val.category;
    //   }
    //   return [];
    // },
    getGroups() {
      this.groupSelected = undefined;

      if (this.contextSelected && this.categorySelected) {
        let context = this.data.find(el => el.id === this.contextSelected);
        if (context) {
          let category = context.category.find(
            el => el.id == this.categorySelected
          );

          if (category) return category.groups;
        }
      }
      return [];
    },
    disabled() {
      return !(
        this.contextSelected &&
        this.categorySelected &&
        this.groupSelected
      );
    },

    createContext() {
      spinalPanelManagerService.openPanel("createGroupContextDialog", {
        title: "Create a Grouping Context",
        type: "context"
      });
    },
    createCategory() {
      spinalPanelManagerService.openPanel("createGroupContextDialog", {
        title: "add Category",
        type: "element",
        contextId: this.contextSelected,
        selectedNode: SpinalGraphService.getInfo(this.contextSelected)
      });
    },
    createGroup() {
      spinalPanelManagerService.openPanel("createGroupContextDialog", {
        title: "add Group",
        type: "element",
        contextId: this.contextSelected,
        selectedNode: SpinalGraphService.getInfo(this.categorySelected)
      });
    },

    //////////////////////////////////////////////////////////////////
    // Modify
    //////////////////////////////////////////////////////////////////

    updateCategory() {
      this.categorySelected = undefined;
      this.categories = [];
      if (this.contextSelected) {
        let val = this.data.find(el => el.id === this.contextSelected);
        if (val) this.categories = val.category;
      }
    },
    updateGroups() {
      this.groupSelected = undefined;
      this.groups = [];
      if (this.contextSelected && this.categorySelected) {
        let context = this.data.find(el => el.id === this.contextSelected);
        if (context) {
          let category = context.category.find(
            el => el.id == this.categorySelected
          );

          if (category) this.groups = category.groups;
        }
      }
    }
  },
  watch: {
    contextSelected() {
      this.updateCategory();
    },
    categorySelected() {
      this.updateGroups();
    }
  }
};
</script>

<style scoped>
.mdDialogContainer {
  width: 400px;
  height: 400px;
}

.mdIcon {
  display: flex;
  align-items: center;
}
</style>