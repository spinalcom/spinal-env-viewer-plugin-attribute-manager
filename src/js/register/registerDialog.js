import Vue from "vue";
const { SpinalMountExtention } = require("spinal-env-viewer-panel-manager-service");

import ParamDialogComponent from "../../vue/dialogs/paramsDialog.vue";
import ImportAttributeExcelDialog from '../../vue/dialogs/importAttributeExcelDialog.vue';
import ExportConfigurationDialog from "../../vue/panels/configurationPanel/dialogs/export.vue"
import ImportConfigurationDialog from "../../vue/panels/configurationPanel/dialogs/import.vue"
import ConfigureGenerationDialog from "../../vue/panels/generateGroupPanel/dialogs/configurations.vue";
import SelectTypeDialog from "../../vue/panels/generateGroupPanel/dialogs/select-type.vue";


const dialogs = [
    // {
    //   name: "linkToGroupDialog",
    //   vueMountComponent: Vue.extend(LinkToGroup),
    //   parentContainer: document.body
    // }, 
    {
        name: "paramDialogComponent",
        vueMountComponent: Vue.extend(ParamDialogComponent),
        parentContainer: document.body
    },
    {
        name: "importAttributeExcelDialog",
        vueMountComponent: Vue.extend(ImportAttributeExcelDialog),
        parentContainer: document.body
    },
    {
        name: "exportConfigurationDialog",
        vueMountComponent: Vue.extend(ExportConfigurationDialog),
        parentContainer: document.body
    }, {
        name: "importConfigurationDialog",
        vueMountComponent: Vue.extend(ImportConfigurationDialog),
        parentContainer: document.body
    }, {
        name: "configureGenerationDialog",
        vueMountComponent: Vue.extend(ConfigureGenerationDialog),
        parentContainer: document.body
    }, {
        name: "selectTypeDialog",
        vueMountComponent: Vue.extend(SelectTypeDialog),
        parentContainer: document.body
    }
];


for (let index = 0; index < dialogs.length; index++) {
    SpinalMountExtention.mount(dialogs[index]);
}