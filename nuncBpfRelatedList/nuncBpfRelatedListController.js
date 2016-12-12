({   
            
    testButton : function (component, event, helper) {
    },
    
    aPress : function (component, event, helper) {
    },
    
    navigateToPageRecord : function(component, event, helper) {
        var selectedRow = event.currentTarget;
        var objId = selectedRow.dataset.id;
        helper.navigateToPageRecord(objId);
    },
    
    handleSObjectEvt : function(component, event, helper) {
        var bpSelected = event.getParam("channel");
        if (bpSelected == "DOD_Blue_Print_Setup__c") {
            helper.getItemsById(component, event);
            helper.getBpItem(component, event);
            helper.disableButton(component, "buttonNewBpf", false);
        }else{
            helper.deleteList(component, "v.list");
            helper.disableButton(component, "buttonNewBpf", true);
        }   
    },
    
    createBpf:function(component, event, helper) {
        var bpId = component.get("v.bpId");
        var bpItem = component.get("v.bpItem");
        helper.createItem(component, bpId, bpItem);
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
            case "Clone":
                //alert("clone");
                break;
            case "Delete":
                var showtoast = true;
                helper.deleteObject(component, quickAction.id, showtoast);
                break;
            case "Details":
                helper.navigateToPageRecord(quickAction.id);
                break;
            default:
                console.log("DOCMA > nuncBpfRelatedListController.js > openQuickMenuAction wrong option");
        } 
    }, 
    
    /*****************************
     * DOCMA EVENT SYSTEM
    *****************************/
    
    handleNewBpfCreatedEvt:function(component, event, helper) {
        var bpItem = helper.getItemEvent(event, "bpItem");
        
        if (bpItem.Id == component.get("v.bpId")) {
            var bpfItem = helper.getItemEvent(event, "bpfItem");
            bpfItem = helper.addBpToBpfItem(bpfItem, bpItem);
            
            helper.addItemList(component, bpfItem, "v.list");
        }
    },
    
    handleNewBpfByBpCreatedEvt:function (component, event, helper) {
        var bpItem = helper.getItemEvent(event, "bpItem");
        
        if (bpItem.Id == component.get("v.bpId")) {
            var bpfItem = helper.getItemEvent(event, "bpfItem");
            
            helper.addItemList(component, bpfItem, "v.list");
        }
    },
    
    handleNewBpfByFaCreatedEvt:function (component, event, helper) {
        var bpItem = helper.getItemEvent(event, "bpItem");

        if (bpItem.Id == component.get("v.bpId")) {
            var bpfItem = helper.getItemEvent(event, "bpfItem");
            
            helper.addItemList(component, bpfItem, "v.list");
        }
    },    
    
    handleBpfEditedEvt:function (component, event, helper) {
        var bpItem = helper.getItemEvent(event, "bpItem");
        
        if (bpItem.Id == component.get("v.bpId")) {
            var bpfItem = helper.getItemEvent(event, "bpfItem");
            
            helper.updateBpfRow(component, "v.list", bpfItem);
        }
    },
    
    handleBpfDeletedEvt:function (component, event, helper) {
        var bpfItem = helper.getItemEvent(event, "bpfItem");
        helper.deleteItemList(component, bpfItem.Id, "v.list");
    },
    
    handleNewBpfClonedEvt:function (component, event, helper) {
        
    }, 
    
    handleBpDeletedEvt:function(component, event, helper) {
        var bpItem = helper.getItemEvent(event, "bpItem");
        
        if (bpItem.Id == component.get("v.bpId")) {
            helper.deleteList(component, "v.list");
            helper.disableButton(component, "buttonNewBpf", true);
        }
    },
    
    handleBpEditedEvt:function (component, event, helper) {
        var newItem = helper.getItemEvent(event, "bpItem");
        
        if (newItem.Id == component.get("v.bpId")) {
            component.set("v.bpItem", newItem);
            var newValue = newItem.Name; // New value
            var listName = "v.list";
            helper.replaceBlueprintList(component, listName, newValue);
        }
    },
})