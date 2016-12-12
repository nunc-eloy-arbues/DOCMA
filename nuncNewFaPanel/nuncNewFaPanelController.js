({
    
    /************************************************************
    * INIT EVENT 
    *************************************************************/
    doInit: function(component, event, helper) {
        //To load the Modal CSS Style
        helper.applyCssModal(component, event);
        
        //Get all Document Type and DATA TYPE values from APEX-SIDE
        //Fires an nuncInitEventDoneEvt Event inside Callback
        helper.getDtList(component);
        helper.getDataTypeList(component);        
        
        var mode = component.get("v.mode");
        var faObject = component.get("v.newObject");
        if (mode == "edit") {
            component.set("v.faOldName", faObject.Name);
        }
    },
    
    //The Select options was initialized. We can set the default values.
    handleInitEventDoneEvt:function(component, event, helper) {
        var mode = component.get("v.mode");
        var callFunction = event.getParam("function");
        var dtId;
        var dtItem;
        var dtSelect;
        
        if (callFunction == "getDataTypeList") {       
            switch(mode) {
                case "new": 
                    break;
                    
                case "createBy":
                    dtId = component.get("v.dtId");
                    dtSelect = helper.getOption(component, "selectDtOption", dtId);
                    component.set("v.dtItem", 
                                  {'sobjectType':'nuncbau__DOD_Type__c', 
                                   'Name':dtSelect.get("v.label"),
                                   'Id':dtSelect.get("v.text")
                                  }); 
                    dtItem = component.get("v.dtItem");
                    helper.setDefaultDt(component, dtItem);
                    break;
                    
                case "edit":
                    dtId = component.get("v.dtId");
                    dtSelect = helper.getOption(component, "selectDtOption", dtId);
                    component.set("v.dtItem", 
                                  {'sobjectType':'nuncbau__DOD_Type__c', 
                                   'Name':dtSelect.get("v.label"),
                                   'Id':dtSelect.get("v.text")
                                  });                     
                    dtItem = component.get("v.dtItem");                    
                    var faItem = component.get("v.newObject");  
                    helper.setDefaultDt(component, dtItem);                    
                    helper.setDefaultDataType(component, faItem.nuncbau__DOD_Field_Data_Type__c);                         
                    break;
                    
                default:
            }
        }
    },
    
    /***********/
    
    saveItem : function(component, event, helper) {                 
        if(helper.validateFaItem(component)){  
            helper.saveItem(component);
        }
    },
    
    /*******************************
     * MODAL Brehavior
    *******************************/
    
    closeModal : function (component, event, helper) {
        helper.closeModal(component);
    },
    
    handleFaEditedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },
    
    handleNewFaByDtCreatedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },
    
    handleNewFaCreatedEvt:function(component, event, helper) {
        helper.closeModal(component)  
    },    
})