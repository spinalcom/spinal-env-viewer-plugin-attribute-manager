import SpinalAttributeService from './classes/spinalAttributeService';
import SpinalConfigurationService from './classes/spinalConfigurationService';

const spinalAttributeService = new SpinalAttributeService();
const spinalConfigurationService = new SpinalConfigurationService()

export default spinalAttributeService;

export {
  spinalAttributeService,
  spinalConfigurationService
}