({
    /******************************
     * INI EVENT
    ******************************/
    
    //Get and save the Doctype list and fires an Component event to inform the whole component.
    getDtList: function(component) {        
        var action = component.get("c.GetItemsDODType"); 
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side  
                    component.set("v.dtList", response.getReturnValue());  
                    this.fireInitEventDoneEvt(component, "getDtList");
                } else {
                    console.log("Server return a null value - Status: "+state);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("Server return an status "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("Server return an ERROR - Status: "+state);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    /***********************************
     * DEFAULT VALUES FUNCTIONS
    ***********************************/
    
    setDefaultDt:function(component, dtItem) {
        var dtOption = this.getOption(component, "selectDtOption", dtItem.Id);
        var dtName = dtOption.get("v.label");
        component.set("v.dtName",dtName);
        this.setOption(component, dtOption, "bpDocType", true);        
    },
    
    getOption:function(component, auraId, itemId) {
        var options = component.find(auraId);
        var indx = 0;
        for(var k in options) {
            if (options[k].get("v.text") == itemId) 
            {
                indx = k;
            }
        }
        
        return options[indx];
    },
    
    setOption:function(component, option, selectName, disabled) {
        option.set("v.value", true);
        var select = component.find(selectName);
        select.set("v.value", option.get("v.text"));
        if(disabled){
            select.set("v.disabled", disabled);
        }
    },
    
    /******************************
     * CREATE OBJECT
    ******************************/    
    validateBpItem: function(component) {        
        // Simplistic error checking
        var validItem = true;
        
        var Name = component.find("itemName");   
        var NameValue = Name.get("v.value");
        
        // Name must not be blank        
        if ($A.util.isEmpty(NameValue)){
            validItem = false;
            Name.set("v.errors", [{message:"Blueprint name can't be blank."}]);
        } else {      
            Name.set("v.errors", null);
        }
        
        return(validItem);
    },
    
    saveItem:function(component, event, helper) { 
        var itemName = component.find("itemName").get("v.value");
        var bpDescription = component.find("bpDescription").get("v.value");
        var bpDocType = component.find("bpDocType").get("v.value");
        
        var mode = component.get("v.mode");
        
        if (mode == "edit") {
            var bpItem = component.get("v.newBpObject");
            component.set("v.newBpObject", 
                          {'sobjectType':'nuncbau__DOD_Blue_Print_Setup__c', 
                           'Name':itemName,
                           'nuncbau__Description__c':bpDescription,
                           'nuncbau__DOD_Type__c':bpDocType,
                           'Id':bpItem.Id
                          }); 
        }else{
            component.set("v.newBpObject", 
                          {'sobjectType':'nuncbau__DOD_Blue_Print_Setup__c', 
                           'Name':itemName,
                           'nuncbau__Description__c':bpDescription,
                           'nuncbau__DOD_Type__c':bpDocType,
                          }); 
        }
        
        this.createNewBpItem(component);
    },
    
    createNewBpItem:function(component) {
        var item = component.get("v.newBpObject");
        var action = component.get("c.SaveItem");
        var mode = component.get("v.mode");   
        
        action.setParams({
            "item": item
        });
       
        action.setCallback(this, function(response){
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                if (response.getReturnValue() != null){                   
                    var rItem = response.getReturnValue();
                    
                    if (mode == "edit"){
                        this.fireBpEditedEvt(component, rItem);
                    }else if (mode == "createBy") {
                        this.fireNewBpByDtCreatedEvt(component, rItem);
                    } else if (mode == "new"){
                        var opt = this.getOption(component, "selectDtOption", rItem.nuncbau__DOD_Type__c);
                        var dtName = opt.get("v.label");          
                        
                        component.set("v.dtItem", 
                          {'sobjectType':'nuncbau__DOD_Type__c', 
                           'Name':dtName,
                           'Id':rItem.nuncbau__DOD_Type__c
                          }); 

                        this.fireNewBpCreatedEvt(component, rItem);
                    }
                    
                } else {
                    component.find("itemName").set("v.errors", [{message:"This name already exists."}]);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete
                
            } else if (state === "ERROR") { // Callback did ERROR
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Server return an ERROR - message: " + errors[0].message);
                    } else console.log("Server return an ERROR - Status: "+ state);                    
                } else {
                    console.log("Server return an ERROR - Status: "+ state);
                } 
            }
        });
        
        $A.enqueueAction(action);
    },
    
    /*******************************
     * EVENTS & TOAST
    *******************************/
    
    fireNewBpCreatedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaNewBpCreatedEvt");
        var dtItem = component.get("v.dtItem");
        var dtId = component.find("bpDocType").get("v.value");
        
        createEvent.setParams ({
            "bpItem": item,
            "dtId":dtId,
            "dtItem":dtItem
        });       
        
        createEvent.fire();
        
        var title = item.Name+" record was created!";
        var msg = "The object was created successfully";
        var type = "success";
        this.showToast(title, msg, type);
    },   
    
    
    fireNewBpByDtCreatedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaNewBpByDtCreatedEvt");
        var dtItem = component.get("v.dtItem");
        createEvent.setParams ({
            "bpItem": item,
            "dtItem": dtItem,
            "dtId":dtItem.Id
        });       
        
        createEvent.fire();
        
        var title = item.Name+" record was created!";
        var msg = "The object was created successfully";
        var type = "success";
        this.showToast(title, msg, type);
    },   
    
    //A BP was edited.
    fireBpEditedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaBpEditedEvt");
        var dtItem = component.get("v.dtItem");
     
        createEvent.setParams ({
            "bpItem": item,
            "dtItem": dtItem,
            "dtId":dtItem.Id
        });       

        createEvent.fire();

        var title = item.Name+" record was edited!";
        var msg = "The object was edited successfully";
        var type = "success";
        this.showToast(title, msg, type);
    }, 
    
    fireInitEventDoneEvt:function(component, callFunction) {   
        var createEvent = component.getEvent("nuncInitEventDoneEvt");   
        createEvent.setParams ({
            "function": callFunction
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
    
    /********************************
     * MODAL CSS
    ********************************/
    applyCssModal:function(cmp,event){
        var cmpTarget = cmp.find('Modalbox');
        var cmpBack = cmp.find('MB-Back');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open');
    },
    
    removeCssModal:function(cmp,event){
        var cmpTarget = cmp.find('Modalbox');
        var cmpBack = cmp.find('MB-Back');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');        
    }, 
    
    closeModal:function(component) {
        $A.get("e.force:closeQuickAction").fire();
        component.find("nuncModalBox").destroy();
    }
})