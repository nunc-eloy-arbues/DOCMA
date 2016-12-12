({   
    handleSObjectEvt : function(component, event, helper) {
        var objSelected = event.getParam("channel");
        if (objSelected != "DOD_Blue_Print_Setup__c")
        {
            helper.getItemsById(component, event);
            helper.enableButton(component, "buttonNewBp", false);
            helper.getDtByBpId(component, event);
            component.set("v.bpIdSelected", "");
        }else if(objSelected == "DOD_Blue_Print_Setup__c") {
            var objId = event.getParam("recordId");
            component.set("v.bpIdSelected", objId);
        }
    },
    
    handleBpIdSelected:function(component, event, helper) {
        var bpRows = component.find("bpRow");
        var itemId = component.get("v.bpIdSelected");
        if (itemId != "") {
            if (Array.isArray(bpRows)) {
                bpRows.forEach(function (o, i) {  
                    var row = o.getElement().dataset.id;
                    if (row == itemId) {
                        $A.util.addClass(o,"nunc-row-selected");               
                    } else {
                        $A.util.removeClass(o,"nunc-row-selected");   
                    }
                }); 
            }else{
                console.log("DOCMA > nuncBpRelatedListController.js > handleBpIdSelected Select error");
            }
        }
    },
    
    navigateToPageRecord : function(component, event, helper) {
        var selectedRow = event.currentTarget;
        var objId = selectedRow.dataset.id;
        helper.navigateToPageRecord(objId);
    },    
    
    /*
     *  $A.util.addClass(selectedRow,"nunc-row-selected");  
     * */
    
    rowSelected : function(component, event, helper) {
        var selectedRow = event.currentTarget;
        var objId = selectedRow.dataset.id;
        var channel ="DOD_Blue_Print_Setup__c";
        
        helper.fireObjectSelected(objId, channel);
        //$A.util.addClass(selectedRow,"nunc-row-selected");  
    },  
    
    testButton : function (component, event, helper) {
    },
    
    aPress : function (component, event, helper) {
    },
    
    createBlueprint:function(component, event, helper) {
        var dtId = component.get("v.dtId");
        var dtItem = component.get("v.dtItem");
        
        helper.createBlueprint(component, dtItem);
    },
    
    /********************************
     * QUICK ACTION MENU 
    ********************************/    
    
    openQuickMenuAction:function(component, event, helper) {
        //quickAction.option = Label selected option (integer)
        //quickAction.id = Id SObject (String)
        //quickAction.item = Object (DOD_Blue_Print_Setup)
        var quickAction = helper.whatQuickAction(event);     
        var showToast = false;
        
        switch(quickAction.option) {
            case "Edit":
                /*helper.navigateToEditRecord(quickAction.id);*/
                helper.openEditRecord(component, quickAction.item);
                break;
            case "Clone":
                showToast = true;
                helper.cloneBpObject(component, quickAction.item, showToast);
                break;
            case "Delete":
                showToast = true;
                helper.deleteObject(component, quickAction.item, showToast);
                break;
            case "New BPF":
                //alert("New Blueprint Field");
                // helper.createBlueprint(component, quickAction.id);
                break;
            case "Details":
                helper.navigateToPageRecord(quickAction.id);
                break;
            default:
                console.log("DOCMA > nuncBpRelatedListController.js > openQuickMenuAction wrong option");
        } 
    }, 
    /*** END QUICK ACTION MENU ***/
    
    /*****************************
     * DOCMA EVENT SYSTEM
    *****************************/
    
    handleNewBpCreatedEvt:function(component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            var bpItem = helper.getItemEvent(event, "bpItem");
            bpItem = helper.addDtToBpItem(bpItem, dtItem);
            
            helper.addItemList(component, bpItem, "v.list");
        }
    },
    
    handleNewBpByDtCreatedEvt:function (component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            var bpItem = helper.getItemEvent(event, "bpItem");
            bpItem = helper.addDtToBpItem(bpItem, dtItem);
            
            helper.addItemList(component, bpItem, "v.list");
        }
    },
    
    handleBpEditedEvt:function (component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            component.set("v.bpIdSelected", "");
            var bpItem = helper.getItemEvent(event, "bpItem");
            bpItem = helper.addDtToBpItem(bpItem, dtItem);
            
            helper.updateBpRow(component, "v.list", bpItem);
        }
    },
    
    handleBpDeletedEvt:function (component, event, helper) {
        var bpItem = helper.getItemEvent(event, "bpItem");
        helper.deleteItemList(component, bpItem.Id, "v.list");
    },
    
    handleBpClonedEvt:function (component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            var bpItem = helper.getItemEvent(event, "bpItem");
            helper.addItemList(component, bpItem, "v.list");
        }
    }, 
    
    handleDtDeletedEvt:function(component, event, helper) {
        var dtItem = helper.getItemEvent(event, "dtItem");
        
        if (dtItem.Id == component.get("v.dtId")) {
            helper.deleteList(component, "v.list");
            helper.enableButton(component, "buttonNewBp", true);
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