({
    
    /********************************
     * INI
    ********************************/
    
    getAmountFa:function(component) {
        var action = component.get("c.GetAmountFields");
        var itemId = component.get("v.object");
        action.setParams({
            "recordID":itemId.Id
        });
        
        action.setCallback(this, function(result) {
            component.set("v.amountFa", result.getReturnValue());
        });
        
        $A.enqueueAction(action);
    },
    
    getAmountBp:function(component) {
        var action = component.get("c.GetAmountRelatedBlueprint");
        var itemId = component.get("v.object");
        
        action.setParams({
            "recordID":itemId.Id
        });
        
        action.setCallback(this, function(result) {
            component.set("v.amountBp", result.getReturnValue());
        });
        
        $A.enqueueAction(action);
    },  
    
    /*******************************
     * MISCELLANY
    *******************************/
    //To add one more at amount variables
    addOne:function(component, name) {
        var amount = component.get(name);
        component.set(name, (amount+1));
    },
    
    removeOne:function(component, name) {
        
        var amount = component.get(name);
        if(amount > 0)
            component.set(name, (amount-1));
    },
    
    /*******************************
     * Quick Actions options
     ******************************/
    
    //What Option whithin of Quick Action Menu was pressed
    whatQuickAction : function(component, event, helper) {
        var indx = event.detail.menuItem.get("v.value");
        var opc = event.detail.menuItem.get("v.title");

        var actionMenuList = component.find("menuQuickAction");
        var actionMenu = [];
        
        /* To know if component.find return us an Object or an Array */
        if (Array.isArray(actionMenuList)) {
            actionMenu = actionMenuList[indx];
        } else {
            actionMenu = actionMenuList;
        }
        // End if
        
        var item = actionMenu.get("v.value");
        
        actionMenu.set("v.visible",false);
        
        return {'id':item.Id, 'option':opc, 'item':item};
    },
    
    //Navigate quick action - Fire Edit event
    navigateToPageRecord:function(item) {
        var myEvent = $A.get("e.force:navigateToSObject");
        myEvent.setParams({
            "recordId": item.Id
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
    
    //Delete quick action - Fire Delete event
    deleteDtObject:function(component, item, showToast) {
        var action = component.get("c.DeleteItemById");
        
        action.setParams({
            "recordID":item.Id
        });
        
        action.setCallback(this, function(response) {           
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side 
                    var rItem = response.getReturnValue();
                    this.fireDtDeletedEvt(component, rItem);                      
                    
                    var title = rItem.Name+"was deleted!";
                    var msg = "The object was deleted successfully";
                    var type = "success";
                    this.showToast(title, msg, type);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("Server return an status "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("Server return an ERROR - Status: "+state);
            }            
        });
        
        $A.enqueueAction(action);	        
    },
    
    //Delete quick action - Fire Delete event
    cloneDtObject:function(component, item, showToast) {
        var action = component.get("c.CloneDtByDtId");
        
        action.setParams({
            "recordID":item.Id
        });
        
        action.setCallback(this, function(response) {           
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side 
                    var rItem = response.getReturnValue();
                    this.fireDtClonedEvt(component, rItem);                      
                    
                    var title = rItem.Name+" was cloned!";
                    var msg = "The object was cloned successfully";
                    var type = "success";
                    this.showToast(title, msg, type);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("Server return an status "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("Server return an ERROR - Status: "+state);
            }            
        });
        
        $A.enqueueAction(action);	        
    },    
    
    //New Blueprint without Document type related
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
                    console.log("DOCMA > nuncDtSliderItemHelper.js > createBlueprint - Bad server response: "+status+"\n "+ errorMessage);
                } else if (status === "ERROR") {
                    console.log("DOCMA > nuncDtSliderItemHelper.js > createBlueprint - Bad server response: "+status+"\n "+ errorMessage);
                }
            }
        );
    },
    
    openDtPanel:function(cmp, item) {
        $A.createComponent(
            "c:nuncNewDtPanel",
            {
                "aura:id" : "nuncModalBox",
                "newDtObject":item,
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
					console.log("DOCMA > nuncDtSliderItemHelper.js > openDtPanel - Bad server response: "+status+"\n "+ errorMessage);
                } else if (status === "ERROR") {
					console.log("DOCMA > nuncDtSliderItemHelper.js > openDtPanel - Bad server response: "+status+"\n "+ errorMessage);
                }
            }
        );
    },  
    
    /***************************************
     * DOCMA EVENTS SYSTEM
     **************************************/
    
    //A tile was deleted. It fire an info event
    fireDtDeletedEvt:function(component, item) {
        var createEvent = $A.get("e.c:docmaDtDeletedEvt");
        
        createEvent.setParams ({
            "dtItem": item
        });  
        
        createEvent.fire();  
    },
    
    //A tile was deleted. It fire an info event
    fireDtClonedEvt:function(component, item) {
        var createEvent = $A.get("e.c:docmaDtClonedEvt");
        
        createEvent.setParams ({
            "dtItem": item
        });  
        
        createEvent.fire();  
    },    
    
    /*************************************
     * DOCMA EVENTS TOOLS 
    *************************************/
    getItemEvent:function(event, fieldName) {
        var item = event.getParam(fieldName);
        return item;
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
    
    
    /***************************************
     * Select Unselect control functions
    ***************************************/
    //A tile was pressed
    fireSObjectEvent:function(component) {
        var item = component.get("v.object");
        var index = component.get("v.index");        
        var myEvent = $A.get("e.ltng:selectSObject");
        myEvent.setParams({"recordId": item.Id, "channel":index});
        myEvent.fire();
    },
    
    updateTileState:function(component) {
        var index = component.get("v.index"); //This tile index
        var sliderFocus = component.get("v.sliderFocus"); //Focus from Slider
        
        if(index==sliderFocus) {
            component.set("v.select",true);      
        }else{    
            component.set("v.select",false);
        }
    },
    
    updateTileSelectClass:function(component) {
        var div = component.find("tileContainer"); //Tile container
        
        if (component.get("v.select")) {
            $A.util.addClass(div,"nunc-tile-selected");
        } else {
            $A.util.removeClass(div,"nunc-tile-selected");
        }
    },
})