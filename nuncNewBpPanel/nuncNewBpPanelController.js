({
    
    /************************************************************
    * INIT EVENT 
    *************************************************************/
    doInit: function(component, event, helper) {
        //To load the Modal CSS Style
        helper.applyCssModal(component, event);
        
        //Get all Document Type values from APEX-SIDE
        //Fires an nuncInitEventDoneEvt Event inside Callback
        helper.getDtList(component);
        
        var mode = component.get("v.mode");
        var bpObject = component.get("v.newBpObject");
        if (mode == "edit") {
            component.set("v.bpOldName", bpObject.Name );
        }
    },
    
    //The Select options was initialized. We can set the default values.
    handleInitEventDoneEvt:function(component, event, helper) {
        var mode = component.get("v.mode");
        var callFunction = event.getParam("function");
        
        if (callFunction == "getDtList") {       
            switch(mode) {
                case "new": 
                    break;
                case "createBy":
                    var dtItem = component.get("v.dtItem");
                    if (dtItem) {
                        helper.setDefaultDt(component, dtItem);
                    } //Comprovation code
                    break;
                case "edit":
                    var dtItem = component.get("v.dtItem");                    
                    if (dtItem) {
                        helper.setDefaultDt(component, dtItem);
                    } //Comprovation code
                    
                    break;
                default:
            }
        }
    },
    
    /***********/
    
    saveItem : function(component, event, helper) {                 
        if(helper.validateBpItem(component)){  
            helper.saveItem(component);
        }
    },
    
    /*******************************
     * MODAL Brehavior
    *******************************/
    
    closeModal : function (component, event, helper) {
        helper.closeModal(component);
    },
    
    handleBpEditedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },
    
    handleNewBpByDtCreatedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },
    
    handleNewBpCreatedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },    
})