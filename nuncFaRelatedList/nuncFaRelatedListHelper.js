({
    
    /****************************
     * INI
    ****************************/
    getItemsById : function (component, event) {
        var action = component.get("c.GetFaListByDtId");
        
        var itemId = event.getParam("recordId");
        component.set("v.dtId", itemId);
        
        action.setParams({
            "recordID":itemId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) {
                    component.set("v.list", response.getReturnValue());       
                } else if (state === "INCOMPLETE") { // Callback response = Incomplete 
                    console.log("DOCMA > nuncFaRelatedListHelper.js > getItemsById - Server response: "+state);
                } else if (state === "ERROR") { // Callback did ERROR
                    console.log("DOCMA > nuncFaRelatedListHelper.js > getItemsById - Server response: "+state);
                } 
            }
        });
        
        $A.enqueueAction(action);       
    },
    
    
    /***************************
     * TOP BAR OPTIONS
    ***************************/
    //Create Blueprint
    createFa : function(cmp, dtId) {  
        $A.createComponent(
            "c:nuncNewFaPanel",
            {
                "aura:id" : "nuncModalBox",
                "mode":"createBy",
                "dtId":dtId
            },
            function(component, status, errorMessage){
                //Add the new button to the body array
                if (status === "SUCCESS") {
                    var div = cmp.find("modalDiv");
                    var bodyDiv = div.get("v.body");
                    bodyDiv.push(component);
                    div.set("v.body", bodyDiv);
                } else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                    // Show offline error
                } else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
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
        var dtItem = item.nuncbau__DOD_Type__r;
        var dtId = item.nuncbau__DOD_Type__r.Id;
        var dtName = item.nuncbau__DOD_Type__r.Name;
        var dataType = item.nuncbau__DOD_Field_Data_Type__c;
        $A.createComponent(
            "c:nuncNewFaPanel",
            {
                "aura:id" : "nuncModalBox",
                "newObject":item,
                "dtId":dtId,
                "dataType":dataType,
                "mode":"edit"
            },
            function(component, status, errorMessage){
                //Add the new button to the body array
                if (status === "SUCCESS") {
                    var div = cmp.find("modalDiv");
                    var bodyDiv = div.get("v.body");
                    bodyDiv.push(component);
                    div.set("v.body", bodyDiv);
                } else if (status === "INCOMPLETE") {
                    console.log("DOCMA > nuncFaRelatedListHelper.js > openEditRecord - Bad server response: "+status+"\n "+ errorMessage);
                } else if (status === "ERROR") {
                    console.log("DOCMA > nuncFaRelatedListHelper.js > openEditRecord - Bad server response: "+status+"\n "+ errorMessage);
                }
            }
        );
    },  
    
    //Delete quick action - Fire Delete event
    deleteObject:function(component, itemId, showToast) {
        var action = component.get("c.DeleteFaById");
        
        action.setParams({
            "recordID":itemId
        });	
        
        action.setCallback(this, function(response) {           
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side 
                    var rItem = response.getReturnValue();
                    this.fireFaDeletedEvt(component, rItem);                      
                    
                    var title = rItem.Name+"was deleted!";
                    var msg = "The object was deleted successfully";
                    var type = "success";
                    this.showToast(title, msg, type);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("DOCMA > nuncFaRelatedListHelper.js > deleteObject - Server response: "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("DOCMA > nuncFaRelatedListHelper.js > deleteObject - Server response: "+state);
            }            
        });
        
        $A.enqueueAction(action);	        
    },
    
    updateList:function(component, itemId) {
        var list = component.get("v.list");
        if(itemId != null) component.set("v.list", this.deleteItemFromList(itemId, list));
    },
    
    //New Blueprint Field
    createBpf : function(cmp, faItem) {
        var id = faItem.Id;
        var name = faItem.Name;
        $A.createComponent(
            "c:nuncNewBpfPanel",
            {
                "aura:id" : "nuncModalBox",
                "faId" : id,
                "faItem" :faItem,
                "faName":name, 
                "dtId":faItem.nuncbau__DOD_Type__c,
                "mode":"createByFa"
            },
            function(component, status, errorMessage){
                
                //Add the new button to the body array
                if (status === "SUCCESS") {
                    var div = cmp.find("modalDiv");
                    var bodyDiv = div.get("v.body");
                    bodyDiv.push(component);
                    div.set("v.body", bodyDiv);
                } else if (status === "INCOMPLETE") {
					console.log("DOCMA > nuncFaRelatedListHelper.js > createBpf - Bad server response: "+status+"\n "+ errorMessage);
                } else if (status === "ERROR") {
					console.log("DOCMA > nuncFaRelatedListHelper.js > createBpf - Bad server response: "+status+"\n "+ errorMessage);
                }
            }
        );
    },
    
    
    /*****************************************
     * EVENTS AND TOAST
    *****************************************/
    
    //A tile was deleted. It fire an info event
    fireFaDeletedEvt:function(component, item) {
        var createEvent = $A.get("e.c:docmaFaDeletedEvt");
        
        createEvent.setParams ({
            "faItem": item,
            "dtId":item.nuncbau__DOD_Type__c
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
    
    addNewFaItem:function(component, item) {
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
    
    addDtToFaItem:function(faItem, dtItem) {
        var item = {
            'sobjectType':'nuncbau__DOD_Field_Assignment__c', 
            'Id':faItem.Id,
            'Name':faItem.Name,
            'nuncbau__Description__c':faItem.nuncbau__Description__c,
            'nuncbau__DOD_Type__c':faItem.nuncbau__DOD_Type__c,
            'nuncbau__DOD_Type__r':{'Id':dtItem.Id, 'Name':dtItem.Name}
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
    
    replaceDoctypeList:function(component, listName, newValue) {
        var list = component.get(listName);
        
        list.forEach(function (o, i) {
            o.nuncbau__DOD_Type__r.Name = newValue;
        }); 
        
        component.set(listName, list);
    },
    
    updateFaRow:function(component, listName, item){
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
})