const events = require('events');
var emitter = new events.EventEmitter();
const Audit = require('../models/audit');
const auditEvent = 'audit';
emitter.on(auditEvent , async function(audit){
    // steps of actions - save into db

    var Auditss = {
        auditAction: audit.auditAction,
        data: audit.data,
        status: audit.status,
        error:audit.error,
        auditOn:audit.auditOn,
      };
      var Audits = await Audit.create(Auditss)

})
exports.prepareAudit=async(auditAction , data , status , error , auditOn)=>{

    status = 200;
    if(error){
        status = 500;
    }

    
    //   var Audits = await Audit.create(Auditss)
    emitter.emit(auditEvent ,{auditAction , data, status , error , auditOn} )
}