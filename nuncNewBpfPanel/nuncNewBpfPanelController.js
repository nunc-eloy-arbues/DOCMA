({
    
    /************************************************************
    * INIT EVENT 
    *************************************************************/
    doInit: function(component, event, helper) {
        //To load the Modal CSS Style
        helper.applyCssModal(component, event);
        var mode = component.get("v.mode"); 
        if (mode == "createByBp") {
            var bpItem = component.get("v.bpItem");
            component.set("v.dtId", bpItem.nuncbau__DOD_Type__c);
            component.set("v.bpName", bpItem.Name);
        }
        
        //Get all Document Type and DATA TYPE values from APEX-SIDE
        //Fires an nuncInitEventDoneEvt Event inside Callback
        helper.getBpList(component);
        helper.getFaList(component);        
        
        if (mode == "edit") {
            var bpfObject = component.get("v.newObject");
            component.set("v.bpfOld", bpfObject);
        }
    },
    
    //The Select options was initialized. We can set the default values.
    handleInitEventDoneEvt:function(component, event, helper) {
        var mode = component.get("v.mode");
        var callFunction = event.getParam("function");
        var bpId;
        var bpItem;
        var bpSelect;
        
        var faId;
        var faItem;
        var faSelect;        
        
        var bpfObject = component.get("v.newObject");
        
        if (callFunction == "getFaList") {       
            switch(mode) {
                case "new": 
                    break;
                    
                case "createByBp":
                    bpId = component.get("v.bpId");
                    bpItem = component.get("v.bpItem");
                    helper.setDefaultBp(component, bpItem);
                    break;
                    
                case "createByFa":
                    faItem = component.get("v.faItem");   
                    //faSelect = helper.getOption(component, "faSelectOption", faItem.Id);
                    helper.setDefaultFa(component, faItem.Id);                    
                    break;                    
                    
                case "edit":
                    bpId = component.get("v.bpId");
                    
                    bpItem = component.get("v.bpItem");  
                    helper.setDefaultBp(component, bpItem); 
                    
                    faId = component.get("v.faId");     
                    helper.setDefaultFa(component, faId);                         
                    break;
                    
                default:
            }
        }
    },
    
    /***********/
    
    saveItem : function(component, event, helper) {                 
        if(helper.validateBpfItem(component)){  
            helper.saveItem(component);
        }
    },
    
    /*******************************
     * MODAL Brehavior
    *******************************/
    
    closeModal : function (component, event, helper) {
        helper.closeModal(component);
    },
    
    handleBpfEditedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },
    
    handleNewBpfByFaCreatedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },
    
    handleNewBpfByBpCreatedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },    
    
    handleNewBpfCreatedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },    
})