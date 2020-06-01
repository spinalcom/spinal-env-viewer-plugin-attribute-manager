import CREATE_DATA from "./data";

export default {
  items: [],
  context: {
    create: false,
    id: "",
    name: ""
  },
  category: {
    createBy: CREATE_DATA.attribute,
    contains: false,
    name: "",
    regex: "",
    separator: "",
    index: 1,
    fixedValue: ""
  },
  group: {
    createBy: CREATE_DATA.attribute,
    contains: false,
    name: "",
    regex: "",
    separator: "",
    index: 1,
    fixedValue: ""
  }
}