({   
    handleSObjectEvt : function(component, event, helper) {
        var dtSelected = event.getParam("channel");
        if (dtSelected != "DOD_Blue_Print_Setup__c") {
            helper.getItemsById(component, event);
        }
    },
    
    testButton : function (component, event, helper) {
    },
    
    aPress : function (component, event, helper) {
    },
    
    createFa:function(component, event, helper) {
        var dtId = component.get("v.dtId");
        helper.createFa(component, dtId);
    },
    
    navigateToPageRecord : function(component, event, helper) {
        var selectedRow = event.currentTarget;
        var objId = selectedRow.dataset.id;
        helper.navigateToPageRecord(objId);
    },
    
    /********************************
     * QUICK ACTION MENU 
    ********************************/    
    
    openQuickMenuAction:function(component, event, helper) {
        //quickAction.option = Label selected option (integer)
        //quickAction.id = Id SObject (String)
        //quickAction.item = Object 
        var quickAction = helper.whatQuickAction(event);     
        
        switch(quickAction.option) {
            case "Edit":
                /*helper.navigateToEditRecord(quickAction.id);*/
                helper.openEditRecord(component, quickAction.item);
                break;
            case "Delete":
                var showtoast = true;
                helper.deleteObject(component, quickAction.id, showtoast);
                break;
            case "New BPF":
                helper.createBpf(component, quickAction.item);
                break;
            case "Details":
                helper.navigateToPageRecord(quickAction.id);
                break;
            default:
                console.log("DOCMA > nuncFaRelatedListController.js > openQuickMenuAction wrong");
        } 
    }, 
    /*** END QUICK ACTION MENU ***/
    
    /*****************************
     * DOCMA EVENT SYSTEM
    *****************************/
    
    handleNewFaCreatedEvt:function(component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            var faItem = helper.getItemEvent(event, "faItem");
            faItem = helper.addDtToFaItem(faItem, dtItem);
            helper.addItemList(component, faItem, "v.list");
        }
    },
    
    handleNewFaByDtCreatedEvt:function (component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            var faItem = helper.getItemEvent(event, "faItem");
            helper.addItemList(component, faItem, "v.list");
        }
    },
    
    handleFaEditedEvt:function (component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            var faItem = helper.getItemEvent(event, "faItem");
            helper.updateFaRow(component, "v.list", faItem);
        }
    },
    
    handleFaDeletedEvt:function (component, event, helper) {
        var faItem = helper.getItemEvent(event, "faItem");
        helper.deleteItemList(component, faItem.Id, "v.list");
    },
    
    handleNewFaClonedEvt:function (component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            var bpItem = helper.getItemEvent(event, "faItem");
            helper.addItemList(component, faItem, "v.list");
        }
    }, 
    
    handleDtDeletedEvt:function(component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            helper.deleteList(component, "v.list");
        }
    },
    
    handleDtEditedEvt:function (component, event, helper) {
        var newItem = helper.getItemEvent(event, "dtItem");
        
        if (newItem.Id == component.get("v.dtId")) {
            component.set("v.dtItem", newItem);
            var newValue = newItem.Name; // New value
            var listName = "v.list";
            helper.replaceDoctypeList(component, listName, newValue);
        }
    },
})