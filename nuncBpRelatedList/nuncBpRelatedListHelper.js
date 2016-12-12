({
    
    /****************************
     * INI
    ****************************/
    getItemsById : function (component, event) {
        var action = component.get("c.GetBluePrintListById");
        
        var itemId = event.getParam("recordId");
        
        action.setParams({
            "recordID":itemId
        });
        
        component.set("v.dtId", itemId);
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) {
                    component.set("v.list", response.getReturnValue());   
                } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                    console.log("Server return an status "+state);
                } else if (state === "ERROR") { // Callback did ERROR
                    console.log("Server return an ERROR - Status: "+state);
                } 
            }
        });
        
        $A.enqueueAction(action);       
    },
    
    getDtByBpId : function (component, event) {
        var action = component.get("c.GetDtByBpId");
        var dtId = component.get("v.dtId");
        
        action.setParams({
            "recordID":dtId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) {
                    var dtItem = response.getReturnValue();
                    component.set("v.dtItem", dtItem); 
                } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                    console.log("Server return an status "+state);
                } else if (state === "ERROR") { // Callback did ERROR
                    console.log("Server return an ERROR - Status: "+state);
                } 
            }
        });
        
        $A.enqueueAction(action);       
    },
    
    
    /***************************
     * TOP BAR OPTIONS
    ***************************/
    //Create Blueprint
    createBlueprint : function(cmp, dtItem) {     
        var id = dtItem.Id;
        var name = dtItem.Name;
        $A.createComponent(
            "c:nuncNewBpPanel",
            {
                "aura:id" : "nuncModalBox",
                "dtId" : id,
                "dtItem" :dtItem,
                "dtName":name, 
                "mode":"createBy"
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

        $A.createComponent(
            "c:nuncNewBpPanel",
            {
                "aura:id" : "nuncModalBox",
                "newBpObject":item,
                "dtItem":dtItem,
                "dtName":dtName,
                "dtId":dtId,
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
					console.log("DOCMA > nuncBpRelatedListHelper.js > openEditRecord - Server response: "+status+"\n "+ errorMessage);
                } else if (status === "ERROR") {
                    console.log("DOCMA > nuncBpRelatedListHelper.js > openEditRecord - Server response: "+status+"\n "+ errorMessage);
                }
            }
        );
    },  
    
    //Delete quick action - Fire Delete event
    deleteObject:function(component, item, showToast) {
        var action = component.get("c.DeleteBlueprintById");
        
        action.setParams({
            "recordID":item.Id
        });	
        
        action.setCallback(this, function(response) {           
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side 
                    var rItem = response.getReturnValue();
                    this.fireBpDeletedEvt(component, rItem);                      
                    
                    var title = rItem.Name+"was deleted!";
                    var msg = "The object was deleted successfully";
                    var type = "success";
                    this.showToast(title, msg, type);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("DOCMA > nuncBpRelatedListHelper.js > deleteObject - Server response: "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("DOCMA > nuncBpRelatedListHelper.js > deleteObject - Server response: "+state);
            }            
        });
        
        $A.enqueueAction(action);	        
    },
    
    updateList:function(component, itemId) {
        var list = component.get("v.list");
        if(itemId != null) component.set("v.list", this.deleteItemFromList(itemId, list));
    },
    
    /*************************************
     * DOCMA EVENTS SYSTEM
    *************************************/
    
    fireBpClonedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaBpClonedEvt");
        var dtItem = {'Id':item.nuncbau__DOD_Type__r.Id, 'Name':item.nuncbau__DOD_Type__r.Name};
        createEvent.setParams ({
            "bpItem": item,
            "dtId":item.nuncbau__DOD_Type__c,
            "dtItem": dtItem
        });       
        
        createEvent.fire();
        
        var title = item.Name+" record was created!";
        var msg = "The object was created successfully";
        var type = "success";
        this.showToast(title, msg, type);
    },   
    
    //A tile was deleted. It fire an info event
    fireBpDeletedEvt:function(component, item) {
        var createEvent = $A.get("e.c:docmaBpDeletedEvt");
        
        createEvent.setParams ({
            "bpItem": item,
            "dtId":item.nuncbau__DOD_Type__c
        });  
        
        createEvent.fire();  
    },    
    
    /*************************************
     * DOCMA EVENTS TOOLS 
    *************************************/
    
    //Delete quick action - Fire Delete event
    cloneBpObject:function(component, item, showToast) {
        var action = component.get("c.CloneBpByBpId");
        
        action.setParams({
            "recordID":item.Id
        });
        
        action.setCallback(this, function(response) {           
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side 
                    var rItem = response.getReturnValue();
                    this.fireBpClonedEvt(component, rItem);                      
                    
                    var title = rItem.Name+" was cloned!";
                    var msg = "The object was cloned successfully";
                    var type = "success";
                    this.showToast(title, msg, type);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("DOCMA > nuncBpRelatedListHelper.js > cloneBpObject - Server response: "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("DOCMA > nuncBpRelatedListHelper.js > cloneBpObject - Server response: "+state);
            }            
        });
        
        $A.enqueueAction(action);	        
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
    
    addNewBpItem:function(component, item) {
        var list = component.get("v.list");  
        list.push(item);
        component.set("v.list", list);
    },    
    
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
    
    addDtToBpItem:function(bpItem, dtItem) {
        var item = {
            'sobjectType':'nuncbau__DOD_Blue_Print_Setup__c', 
            'Id':bpItem.Id,
            'Name':bpItem.Name,
            'nuncbau__Description__c':bpItem.nuncbau__Description__c,
            'nuncbau__DOD_Type__c':bpItem.nuncbau__DOD_Type__c,
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
    
    updateBpRow:function(component, listName, item){
        var list = component.get(listName);
        var index;
        
        list.forEach(function(o,i) {
            if (o.Id == item.Id) {
                index = i;
            }
        });
        
        list[index].Name = item.Name;
        list[index].nuncbau__Description__c = item.nuncbau__Description__c;
        //component.set("v.bpIdSelected", item.Id);
        component.set(listName, list);
    },
    
    enableButton:function(component, buttonName, opc) {
        var button = component.find(buttonName);
        var att = button.get("v.HTMLAttributes");
        att.disabled = opc;
        button.set("v.HTMLAttributes", att);
    },   
    
    /***************************************
     * Select Unselect control functions
    ***************************************/
    fireObjectSelected:function(objId, channel) {
        var myEvent = $A.get("e.ltng:selectSObject");
        myEvent.setParams({"recordId": objId, "channel":channel});
        myEvent.fire(); 
    },
})