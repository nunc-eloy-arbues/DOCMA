({
    /******************************
     * INI EVENT
    ******************************/
    
    //Get and save the Doctype list and fires an Component event to inform the whole component.
    getDtList: function(component) {        
        var action = component.get("c.GetDocTypeList"); 
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side  
                    component.set("v.dtList", response.getReturnValue());  
                } else {
                    console.log("DOCMA > nuncNewFaPanelHelper.js > getDtList - Server response: "+state);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("DOCMA > nuncNewFaPanelHelper.js > getDtList - Server response: "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("DOCMA > nuncNewFaPanelHelper.js > getDtList - Server response: "+state);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    //Get and save the Doctype list and fires an Component event to inform the whole component.
    getDataTypeList: function(component) {        
        var action = component.get("c.GetDataTypeList"); 
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side  
                    component.set("v.dataTypeList", response.getReturnValue());  
                    this.fireInitEventDoneEvt(component, "getDataTypeList");
                } else {
                    console.log("DOCMA > nuncNewFaPanelHelper.js > getDataTypeList - Server response: "+state);
                }
            } else if (state === "INCOMPLETE") { // Callback response = Incomplete               
                console.log("DOCMA > nuncNewFaPanelHelper.js > getDataTypeList - Server response: "+state);
            } else if (state === "ERROR") { // Callback did ERROR
                console.log("DOCMA > nuncNewFaPanelHelper.js > getDataTypeList - Server response: "+state);
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
        this.setOption(component, dtOption, "faDocType", true);        
    },
    
    setDefaultDataType:function(component, dataType) {
        var dataTypeOption = this.getOption(component, "selectDataTypeOption", dataType);
        var dtName = dataTypeOption.get("v.label");
        component.set("v.dtName",dtName);
        this.setOption(component, dataTypeOption, "faDataType", false);        
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
    validateFaItem: function(component) {        
        // Simplistic error checking
        var validItem = true;
        
        var Name = component.find("itemName");   
        var NameValue = Name.get("v.value");
        
        // Name must not be blank        
        if ($A.util.isEmpty(NameValue)){
            validItem = false;
            Name.set("v.errors", [{message:"Name can't be blank."}]);
        } else {      
            Name.set("v.errors", null);
        }
        
        return(validItem);
    },
    
    saveItem:function(component, event, helper) { 
        var itemName = component.find("itemName").get("v.value");
        var faDocType = component.find("faDocType").get("v.value");
        var faDataType = component.find("faDataType").get("v.value");        
        
        var mode = component.get("v.mode");
        
        if (mode == "edit") {
            var faItem = component.get("v.newObject");
            component.set("v.newObject", 
                          {'sobjectType': 'DOD_Field_Assignment__c',
                           'Name':itemName,
                           'nuncbau__DOD_Type__c':faDocType,
                           'nuncbau__DOD_Field_Data_Type__c':faDataType,
                           'Id':faItem.Id
                          });          
        }else{
            component.set("v.newObject", 
                          {'sobjectType': 'DOD_Field_Assignment__c',
                           'Name':itemName,
                           'nuncbau__DOD_Type__c':faDocType,
                           'nuncbau__DOD_Field_Data_Type__c':faDataType
                          });
            
        }
        
        this.createNewItem(component);
    },
    
    createNewItem:function(component) {
        var item = component.get("v.newObject");
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
                        this.fireFaEditedEvt(component, rItem);
                    }else if (mode == "createBy") {
                        this.fireNewFaByDtCreatedEvt(component, rItem);
                    } else if (mode == "new"){
                        var dtSelect = this.getOption(component, "selectDtOption", rItem.nuncbau__DOD_Type__c);
                        
                        var dtName = dtSelect.get("v.label");          
                        
                        component.set("v.dtItem", 
                                      {'sobjectType':'nuncbau__DOD_Type__c', 
                                       'Name':dtName,
                                       'Id':rItem.nuncbau__DOD_Type__c
                                      }); 
                        
                        this.fireNewFaCreatedEvt(component, rItem);
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
    
    fireNewFaCreatedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaNewFaCreatedEvt");
        var dtItem = component.get("v.dtItem");
        var dtId = component.find("faDocType").get("v.value");
        
        createEvent.setParams ({
            "faItem": item,
            "dtId":dtId,
            "dtItem":dtItem
        });       
        
        createEvent.fire();
        
        var title = item.Name+" record was created!";
        var msg = "The object was created successfully";
        var type = "success";
        this.showToast(title, msg, type);
    },   
    
    
    fireNewFaByDtCreatedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaNewFaByDtCreatedEvt");
        var dtItem = component.get("v.dtItem");
        createEvent.setParams ({
            "faItem": item,
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
    fireFaEditedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaFaEditedEvt");
        var dtItem = component.get("v.dtItem");
        
        createEvent.setParams ({
            "faItem": item,
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