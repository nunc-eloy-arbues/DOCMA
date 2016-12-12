({
    
    /****************************
     * INI
    ****************************/
    getItemsById : function (component, event) {
        var action = component.get("c.GetBpfListByBpId");
        
        var itemId = event.getParam("recordId");
        component.set("v.bpId", itemId);
        
        action.setParams({
            "recordId":itemId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) {
                    component.set("v.list", response.getReturnValue());       
                } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                    console.log("DOCMA > nuncBpfRelatedListHelper.js > getItemsById - Server response: "+state);
                } else if (state === "ERROR") { // Callback did ERROR
                    console.log("DOCMA > nuncBpfRelatedListHelper.js > getItemsById - Server response: "+state);
                } 
            }
        });
        
        $A.enqueueAction(action);       
    },
    
    getBpItem : function (component, event) {
        var action = component.get("c.GetBpInfoByBpId");
        
        var itemId = event.getParam("recordId");
        component.set("v.bpId", itemId);
        
        action.setParams({
            "recordId":itemId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) {
                    component.set("v.bpItem", response.getReturnValue());       
                } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                    console.log("DOCMA > nuncBpfRelatedListHelper.js > getBpItem - Server response: "+state);
                } else if (state === "ERROR") { // Callback did ERROR
                    console.log("DOCMA > nuncBpfRelatedListHelper.js > getBpItem - Server response: "+state);
                } 
            }
        });
        
        $A.enqueueAction(action);       
    },    
    
    
    /***************************
     * TOP BAR OPTIONS
    ***************************/
    //Create Blueprint
    createItem : function(cmp, bpId, bpItem) {  
        $A.createComponent(
            "c:nuncNewBpfPanel",
            {
                "aura:id" : "nuncModalBox",
                "mode":"createByBp",
                "bpId":bpId,
                "bpItem":bpItem
            },
            function(component, status, errorMessage){
                //Add the new button to the body array
                if (status === "SUCCESS") {
                    var div = cmp.find("modalDiv");
                    var bodyDiv = div.get("v.body");
                    bodyDiv.push(component);
                    div.set("v.body", bodyDiv);
                } else if (status === "INCOMPLETE") {
                    console.log("DOCMA > nuncBpfRelatedListHelper.js > createItem - Bad server response: "+status+"\n "+ errorMessage);
                    // Show offline error
                } else if (status === "ERROR") {
                    console.log("DOCMA > nuncBpfRelatedListHelper.js > createItem - Bad server response: "+status+"\n "+ errorMessage);
                    // Show error message
                }
            }
        );
    }, 
    
    /*******************************
     * Quick Actions options
     ******************************/
    
    //What Option whithin of Quick Action Menu was pressed
    whatQuickAction : function(event) {
        var item = event.detail.menuItem.get("v.value");
        var opc = event.detail.menuItem.get("v.title");
        
        return {'id':item.Id, 'option':opc, 'item':item};
    },
    
    //Navigate quick action - Fire Edit event
    navigateToPageRecord:function(itemId) {
        var myEvent = $A.get("e.force:navigateToSObject");
        myEvent.setParams({
            "recordId": itemId
        });
        myEvent.fire();
    }, 
    
    //Edit quick action - Fire Edit event. Need to refresh the Slider list after edit.
    navigateToEditRecord:function(itemId) {
        var myEvent = $A.get("e.force:editRecord");
        myEvent.setParams({
            "recordId": itemId
        });        
        
        myEvent.fire();
    },  
    
    openEditRecord:function(cmp, item) {
        var bpItem = cmp.get("v.bpItem");

        $A.createComponent(
            "c:nuncNewBpfPanel",
            {
                "aura:id" : "nuncModalBox",
                "mode":"edit",
                "newObject":item,
                "bpId":item.nuncbau__Blue_Print_Name__c,
                "dtId":bpItem.nuncbau__DOD_Type__c,
                "bpItem":bpItem,
                "faId":item.nuncbau__DOD_Field__c
            },
            function(component, status, errorMessage){
                //Add the new button to the body array
                if (status === "SUCCESS") {
                    var div = cmp.find("modalDiv");
                    var bodyDiv = div.get("v.body");
                    bodyDiv.push(component);
                    div.set("v.body", bodyDiv);
                } else if (status === "INCOMPLETE") {
                    console.log("DOCMA > nuncDtSliderItemHelper.js > openEditRecord - Bad server response: "+status+"\n "+ errorMessage);
                } else if (status === "ERROR") {
                    console.log("DOCMA > nuncDtSliderItemHelper.js > openEditRecord - Bad server response: "+status+"\n "+ errorMessage);
                }
            }
        );
    },  
    
    //Delete quick action - Fire Delete event
    deleteObject:function(component, itemId, showToast) {
        var action = component.get("c.DeleteBpfById");
        action.setParams({
            "recordId":itemId
        });	
        
        action.setCallback(this, function(response) {           
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side 
                    var rItem = response.getReturnValue();
                    this.fireBpfDeletedEvt(component, rItem);                      
                    
                    var title = rItem.Name+" was deleted!";
                    var msg = "The object was deleted successfully";
                    var type = "success";
                    this.showToast(title, msg, type);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("DOCMA > nuncBpfRelatedListHelper.js > deleteObject - Server response: "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("DOCMA > nuncBpfRelatedListHelper.js > deleteObject - Server response: "+state);
            }            
        });
        
        $A.enqueueAction(action);	        
    },
    
    updateList:function(component, itemId) {
        var list = component.get("v.list");
        if(itemId != null) component.set("v.list", this.deleteItemFromList(itemId, list));
    },   
    
    /*****************************************
     * EVENTS AND TOAST
    *****************************************/
    
    //An item was deleted. It fire an info event
    fireBpfDeletedEvt:function(component, item) {
        var createEvent = $A.get("e.c:docmaBpfDeletedEvt");
        
        createEvent.setParams ({
            "bpfItem": item,
            "bpId":item.nuncbau__Blue_Print_Name__c
        });  
        
        createEvent.fire();  
    },
    
    showToast:function(title, msg, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": msg,
            "type":type
        });
        
        toastEvent.fire();
    },
    
    addNewBpfItem:function(component, item) {
        var list = component.get("v.list");  
        list.push(item);
        component.set("v.list", list);
    },
    
    /*************************************
     * DOCMA EVENTS SYSTEM 
    *************************************/
    getItemEvent:function(event, fieldName) {
        var item = event.getParam(fieldName);
        return item;
    },
    
    addItemList:function(component, item, listName) {
        var list = component.get(listName);  
        list.push(item);
        component.set(listName, list);
    },
    
    addItemListByIndex:function(component, item, listName, index) {
        var list = component.get(listName);  
        list[index] = item;
        component.set(listName, list);
    },    
    
    deleteItemList:function(component, item, listName) {
        var list = component.get(listName);
        var newList = this.deleteItemFromList(item, list)
        component.set(listName,newList);
    },
    
    deleteItemFromList : function (item, list) {
        list.forEach(function (o, i) {  
            if (list[i].Id === item) {
                list.splice(i, 1);               
            } 
        });
        return list;
    },   
    
    deleteList:function(component, listName) {
        component.set(listName,[]);
    },
    
    addBpToBpfItem:function(bpfItem, bpItem) {
        var item = {
            'sobjectType':'nuncbau__DOD_User_Dialog_Field__c', 
            'Id':bpfItem.Id,
            'Name':bpfItem.Name,
            'nuncbau__Blue_Print_Name__c':bpfItem.nuncbau__Blue_Print_Name__c,
            'nuncbau__DOD_Field__c':bpfItem.nuncbau__DOD_Field__c,
            'nuncbau__Fixed__c':bpfItem.nuncbau__Fixed__c,
            'nuncbau__Value__c':bpfItem.nuncbau__Value__c,
            'nuncbau__Blue_Print_Name__r':{'Id':bpItem.Id, 'Name':bpItem.Name}
        };
        
        return item;
    },
    
    getIndexFromList:function(component, listName, itemId) {
        var list = component.get(listName);
        var index = false;
        list.forEach(function(o,i) {
            if (itemId == o.Id) {
                index = i;
            }                  
        });
        
        return index;
    },    
    
    replaceBlueprintList:function(component, listName, newValue) {
        var list = component.get(listName);

        list.forEach(function (o, i) {
            o.nuncbau__Blue_Print_Name__r.Name = newValue;
        }); 

        component.set(listName, list);
    },
    
    updateBpfRow:function(component, listName, item){
        var list = component.get(listName);
        var index;
        
        list.forEach(function(o,i) {
            if (o.Id == item.Id) {
                index = i;
            }
        });
        
        list[index] = item;
        component.set(listName, list);
    },
        
    disableButton:function(component, buttonName, opc) {
        var button = component.find(buttonName);
        var att = button.get("v.HTMLAttributes");
        att.disabled = opc;
        button.set("v.HTMLAttributes", att);
    }
})