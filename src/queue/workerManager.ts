import salesWorker from './workers/worker'
import salesWorkerCallback from './workers/salesQueue.worker'

const SALES_QUEUENAME = 'sales'


export default{
  init() {
    salesWorkerCallback.init(SALES_QUEUENAME)
    salesWorker.init(SALES_QUEUENAME, salesWorkerCallback.messageReceivedEvent)
  }
}