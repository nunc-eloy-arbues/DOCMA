({
    doInit: function(component, event, helper) {
        helper.getItemsDT(component);
    },
    
    doAction:function(component, event, helper) {
        //alert("Acción hecha");
    },
    
    handleInitEventDoneEvt:function(component, event, helper) {
        helper.calculateEndPoint(component);    	
    },
    
    handleEventAction : function (component, event, helper) {
        helper.handleEventAction(component);
    },
    
    faChangeHandler:function(component, event, helper) {
        var tileSelected = event.getParam("channel");
        if (tileSelected != "DOD_Blue_Print_Setup__c") {
            component.set("v.tileSelected",tileSelected);   
        }        
    },
    
    handleStartPointChange:function(component, event, helper)
    {
        helper.calculateEndPoint(component);
    },
    
    handleClickNext:function(component, event, helper) {
        helper.sliderNextPage(component, event, helper);
    },
    
    handleClickPrev:function(component, event, helper) {
        helper.sliderPrevPage(component, event, helper);
    },
    
    validateInput:function(component, event, helper) {
        var nItems = component.get("v.list").length;
        var pageSize = component.get("v.pageSize");
        var inputValue = component.find("inputPageSize");
        
        if(!helper.validateInput(inputValue, pageSize, nItems))
        {
            var startPoint = component.get("v.startPoint");
            component.find("inputPageSize").set("v.value",nItems-startPoint);
            helper.calculateEndPoint(component);
        }else{
            helper.calculateEndPoint(component);
        }
    },
    
    /*****************************
     * DOCMA EVENT SYSTEM
    *****************************/
    
    handleDtDeletedEvt : function(component, event, helper) {        
        var dtItem = helper.getItemEvent(event, "dtItem");
        helper.deleteItemList(component, dtItem.Id, "v.list");
    },  
    
    handleDtClonedEvt:function(component, event, helper) {
        var newItem = event.getParam("dtItem");
        helper.addItemList(component, newItem, "v.list");
    },
    
    handleDtEditedEvt:function(component, event, helper) {
        var newItem = event.getParam("dtItem");
        helper.replaceItemList(component, newItem, "v.list");        
    },
})