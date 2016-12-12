({   
    doInit:function(component, event, helper) {    
        helper.getAmountFa(component);
        helper.getAmountBp(component);
    },
    
    /**************************
     * Select / Undselect control
    **************************/
    
    /* The user has selected a tile over the Slider
     * Lauch an event to inform What SObject & Tile index was selected */ 
    tileSelected : function(component, event, helper) {
        helper.fireSObjectEvent(component);
    },  
    
    //Change the tile attribute "v.select" value true/false
    updateTileState:function(component, event, helper) {
        helper.updateTileState(component);
    },
    
    //Check attribute "v.select" value to add or delete CSS class
    updateSelect:function(component, event, helper) {
        helper.updateTileSelectClass(component);
    },   
    
    /********************************
     * DOCMA EVENT SYSTEM
    ********************************/
    
    handleNewBpCreatedEvt:function(component, event, helper) {
        var newItem = event.getParam("bpItem");
        var dtItem = component.get("v.object");
        
        if(newItem.nuncbau__DOD_Type__c == dtItem.Id){
            helper.addOne(component, "v.amountBp");
        }
    },
    
    handleNewBpByDtCreatedEvt:function(component, event, helper) {
        var newItem = event.getParam("bpItem");
        var dtItem = component.get("v.object");
        
        if(newItem.nuncbau__DOD_Type__c == dtItem.Id){
            helper.addOne(component, "v.amountBp");
        }
    },
    
    handleBpDeletedEvt:function(component, event, helper) {
        var item = event.getParam("bpItem");
        var dtItem = component.get("v.object");
        var amount = component.get("v.amountBp");
        
        if(item.nuncbau__DOD_Type__c == dtItem.Id && amount > 0){
            helper.removeOne(component, "v.amountBp");
        }
    },
    
    handleBpClonedEvt:function(component, event, helper) {
        var newItem = event.getParam("bpItem");
        var dtItem = component.get("v.object");
        
        if(newItem.nuncbau__DOD_Type__c == dtItem.Id){
            helper.addOne(component, "v.amountBp");
        }
    },
    
    handleDtEditedEvt:function (component, event, helper) {
        var newItem = helper.getItemEvent(event, "dtItem");
        var dtItem = component.get("v.object");
        
        if(newItem.Id == dtItem.Id){
            component.set("v.object",newItem);
        }                   
    },
    
    handleNewFaByDtCreatedEvt:function(component, event, helper) {
        var newItem = helper.getItemEvent(event, "faItem");
        var dtItem = component.get("v.object");
        
        if(newItem.nuncbau__DOD_Type__c == dtItem.Id){
            helper.addOne(component, "v.amountFa");
        }
    },
    
    
    handleFaDeletedEvt:function(component, event, helper) {
        var item = helper.getItemEvent(event, "faItem");
        var dtItem = component.get("v.object");
        var amount = component.get("v.amountFa");
        
        if(item.nuncbau__DOD_Type__c == dtItem.Id && amount > 0) {
            helper.removeOne(component, "v.amountFa");
        }
    },
    
    /********************************
     * QUICK ACTION MENU 
    ********************************/    
    
    openQuickMenuAction:function(component, event, helper) {
        //quickAction.option = Label selected option (integer)
        //quickAction.id = Id Object (String)
        //quickAction.item = Doctype Object
        
        var quickAction = helper.whatQuickAction(component, event, helper);     
        var showToast = false;
        
        switch(quickAction.option) {
            case "Edit":
                helper.openDtPanel(component, quickAction.item);
                break;
            case "Clone":
                showToast = true;
                helper.cloneDtObject(component, quickAction.item, showToast);
                break;
            case "Delete":
                showToast = true;
                helper.deleteDtObject(component, quickAction.item, showToast);
                break;
            case "New Blueprint":
                helper.createBlueprint(component, quickAction.item);
                break;
            case "Details":
                helper.navigateToPageRecord(quickAction.item);
                break;
            default:
                console.log("DOCMA > nuncDtSliderItemController.js > openQuickMenuAction - quickAction mistake");
        } 
    }, 
    
    /*** END QUICK ACTION MENU ***/
})