({
    
    /************************************************************
    * INIT EVENT 
    *************************************************************/
    doInit: function(component, event, helper) {
        //To load the Modal CSS Style
        helper.applyCssModal(component, event);
        
        var mode = component.get("v.mode");
        var object = component.get("v.newDtObject");
        if (mode == "edit") {
            component.set("v.dtOld", object);
        }
        
    },
    
    /***********/
    
    saveItem : function(component, event, helper) {                 
        if(helper.validateDtItem(component)){  
            helper.saveItem(component);
        }
    },
    
    /*******************************
     * MODAL Brehavior
    *******************************/
    
    closeModal : function (component, event, helper) {
        helper.closeModal(component);
    },
    
    handleDtEditedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },
     
    handleNewDtCreatedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },    
})