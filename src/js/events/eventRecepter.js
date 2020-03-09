import EventBus from './events';
import controllers from './controllers'

EventBus.$on("selectElement", (data) => {
  controllers.selectitemInViewer(data.id);
})