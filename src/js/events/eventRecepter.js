import EventBus from './events';
import controllers from './controllers'

EventBus.$on("selectElement", (data) => {
  controllers.selectitemInViewer(data.id);
})

EventBus.$on("select", (data) => {
  controllers.selectObject(data);
})

EventBus.$on("isolate", (data) => {
  controllers.IsolateObject(data);
})

EventBus.$on("fitToView", (data) => {
  controllers.zoomObject(data);
})