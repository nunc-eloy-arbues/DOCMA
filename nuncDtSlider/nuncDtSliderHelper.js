({
    getItemsDT : function(component) {
        var action = component.get("c.GetItemsDT");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var listTest = response.getReturnValue();
            
            if(component.isValid() && state === "SUCCESS") {    
                var listResponse = response.getReturnValue();
                component.set("v.list", listResponse);   
                this.fireInitEventDoneEvt(component, "getItemsDT");
            }else{
                console.log("DOCMA > nuncDtSliderHelper.js > getItemsDT - Server response: "+state);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    updateSlider : function(component, itemId) {
        var list = component.get("v.list");       
        if(itemId != null) component.set("v.list",this.deleteItemFromList(itemId, list));
    },
    
    deleteItemFromList : function (oItem, list) {
        list.forEach(function (o, i) {  
            if (list[i].Id === oItem) {
                list.splice(i, 1);               
            } 
        });
        return list;
    },
    
    calculateEndPoint:function(component) {
        var startPoint = component.get("v.startPoint");
        var pageSize = component.get("v.pageSize");
        var nItems = (component.get("v.list")).length;
        
        if ((startPoint + pageSize) > nItems) {
            startPoint = nItems - pageSize;
            component.set("v.startPoint", startPoint);
        }else {
            component.set("v.endPoint", startPoint+pageSize);    
        }
    },
    
    validateInput:function(input, pageSize, nItems){
        var res = false;
        if (pageSize > nItems){
            input.set("v.errors",[{message:"Max item allowed "+nItems}]);                          
        }else{
            res=true;
            input.set("v.errors",null);  
        }
        return res;
    },    
    
    sliderNextPage:function(component, event, helper) {
        var nItems =component.get("v.list").length;
        var startPoint = component.get("v.startPoint");
        var endPoint = component.get("v.endPoint");
        var pageSize = component.get("v.pageSize");
        var res = 0;
        
        if ((endPoint + pageSize) > nItems) {
            res = nItems - endPoint;
            component.set("v.startPoint", startPoint+res);    
        }else { 
            component.set("v.startPoint", startPoint+pageSize);            
        }       
    },
    
    sliderPrevPage:function(component, event, helper) {
        var nItems = component.get("v.list").length;
        var startPoint = component.get("v.startPoint");
        var endPoint = component.get("v.endPoint");
        var pageSize = component.get("v.pageSize");
        var res = 0;
        
        if ((startPoint - pageSize) < 0)
        {
            res = pageSize - (pageSize - startPoint);
            component.set("v.startPoint", startPoint-res);
        }else { 
            component.set("v.startPoint", startPoint-pageSize);            
        }
    }, 
    
    fireInitEventDoneEvt:function(component, callFunction) {   
        var createEvent = component.getEvent("nuncInitEventDoneEvt");   
        createEvent.setParams ({
            "function": callFunction
        });       
        createEvent.fire();
    },    
    
    /************************************
     * DOCMA EVENT TOOLS
    ************************************/
    
    getItemEvent:function(event, fieldName) {
        var item = event.getParam(fieldName);
        return item;
    },
    
    deleteItemList:function(component, itemId, listName) {
        var list = component.get(listName);
        var newList = this.deleteItemFromList(itemId, list)
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
    
    
    addItemList:function(component, item, listName) {
        var list = component.get(listName);  
        list.push(item);
        component.set(listName, list);
    },
    
    replaceItemList:function(component, item, listName) {
        var list = component.get(listName); 
        var index = false;
        
        list.forEach(function (o, i) {  
            if (o.Id == item.Id) {
                index = i;
            } 
        });
        
        if (index) list[index] = item;
        component.set("v.list", list);    
    },         
})