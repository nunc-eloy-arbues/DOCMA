({
    /******************************
     * INI EVENT
    ******************************/
    
    //Get and save the Doctype list and fires an Component event to inform the whole component.
    getBpList: function(component) {        
        var action = component.get("c.GetBpListByDtId"); 
        var dtId = component.get("v.dtId");

        action.setParams({
            'recordID':dtId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side  
                    component.set("v.bpList", response.getReturnValue());  
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
    
    //Get and save the Doctype list and fires an Component event to inform the whole component.
    getFaList: function(component) {        
        var action = component.get("c.GetFaListByDtId"); 
        var dtId = component.get("v.dtId");
        
        action.setParams({
            'recordID':dtId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                if (response.getReturnValue() != null) { //If we recive null, something was wrong in Server-side              
                    var list = response.getReturnValue();
                    list.unshift("");
                    component.set("v.faList", list);  
                    this.fireInitEventDoneEvt(component, "getFaList");
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
    
    setDefaultBp:function(component, item) {
        var bpOption = this.getOption(component, "bpSelectOption", item.Id);
        var bpName = bpOption.get("v.label");
        component.set("v.bpName",bpName);
        this.setOption(component, bpOption, "bpSelect", true);        
    },
    
    setDefaultFa:function(component, itemId) {
        var faOption = this.getOption(component, "faSelectOption", itemId);
        var faName = faOption.get("v.label");
        component.set("v.faName",faName);
        var mode = component.get("v.mode");
        if (mode == "edit"){
             this.setOption(component, faOption, "faSelect", false);      
        }else  {
            this.setOption(component, faOption, "faSelect", true);            
        }
    },
    
    getOption:function(component, auraId, itemId) {
        var options = component.find(auraId);
        var indx = 0;
        var res;

        if (Array.isArray(options)) {
            for(var k in options) {
                if (options[k].get("v.text") == itemId) 
                {
                    res = options[k];
                }
            }
        }else{
            res = options;
        }
        return res;
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
    validateBpfItem: function(component) {        
        // Simplistic error checking
        var validItem = true;
        
        var faSelect = component.find("faSelect");
        var faSelectValue = faSelect.get("v.value");
        
        if (faSelectValue == undefined || faSelectValue == "" || faSelectValue == null) {
            validItem = false;
            faSelect.set("v.errors", [{message:"Document Type Field can't be blank."}]);
        } else {
            faSelect.set("v.errors", null);
        }
        
        return(validItem);
    },
    
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
        var bpSelect = component.find("bpSelect").get("v.value");
        var faSelect = component.find("faSelect").get("v.value");        
        var bpfValue = component.find("bpfValue").get("v.value");   
        var bpfFixed = component.find("bpfFixed").get("v.value");          
        
        var mode = component.get("v.mode");
        
        if (mode == "edit") {
            var faItem = component.get("v.newObject");
            component.set("v.newObject", 
                          { 
                              'sobjectType': 'DOD_User_Dialog_Field__c',
                              'nuncbau__Blue_Print_Name__c': bpSelect,
                              'nuncbau__DOD_Field__c': faSelect,
                              'nuncbau__Fixed__c': bpfFixed,
                              'nuncbau__Value__c': bpfValue,
                              'Id':faItem.Id
                          });          
        }else{
            component.set("v.newObject", 
                          { 
                              'sobjectType': 'DOD_User_Dialog_Field__c',
                              'nuncbau__Blue_Print_Name__c': bpSelect,
                              'nuncbau__DOD_Field__c': faSelect,
                              'nuncbau__Fixed__c': bpfFixed,
                              'nuncbau__Value__c': bpfValue
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
                        this.fireBpfEditedEvt(component, rItem);
                    }else if (mode == "createByBp") {
                        this.fireNewBpfByBpCreatedEvt(component, rItem);
                    }else if (mode == "createByFa") {
                        this.fireNewBpfByFaCreatedEvt(component, rItem);                        
                    } else if (mode == "new"){
                        var bpSelect = this.getOption(component, "bpSelectOption", rItem.nuncbau__Blue_Print_Name__c);
                        var faSelect = this.getOption(component, "faSelectOption", rItem.nuncbau__DOD_Field__c);                        
                        
                        var bpName = bpSelect.get("v.label");          
                        var faName = faSelect.get("v.label");                                  
                        
                        component.set("v.bpItem", 
                                      {'sobjectType':'nuncbau__DOD_Blue_Print_Setup__c', 
                                       'Name':bpName,
                                       'Id':rItem.nuncbau__Blue_Print_Name__c
                                      }); 
                        
                        component.set("v.faItem", 
                                      {'sobjectType':'nuncbau__DOD_Field_Assignment__c', 
                                       'Name':faName,
                                       'Id':rItem.nuncbau__DOD_Field__c
                                      });                         
                        
                        this.fireNewBpfCreatedEvt(component, rItem);
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
    
    fireNewBpfCreatedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaNewBpfCreatedEvt");
        var bpItem = component.get("v.bpItem");
        var bpId = component.find("bpSelect").get("v.value");
        var faItem = component.get("v.faItem");
        
        
        createEvent.setParams ({
            "bpfItem":item,
            "bpItem": bpItem,
            "bpId":bpItem.Id,
            "faItem":faItem
        });       
        
        createEvent.fire();
        
        var title = item.Name+" record was created!";
        var msg = "The object was created successfully";
        var type = "success";
        this.showToast(title, msg, type);
    },   
    
    
    fireNewBpfByBpCreatedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaNewBpfByBpCreatedEvt");
        var bpItem = component.get("v.bpItem");
        var bpId = component.find("bpSelect").get("v.value");
        
        
        createEvent.setParams ({
            "bpfItem":item,
            "bpItem": bpItem,
            "bpId":bpItem.Id,
        });        
        
        createEvent.fire();
        
        var title = item.Name+" record was created!";
        var msg = "The object was created successfully";
        var type = "success";
        this.showToast(title, msg, type);
    },
    
    fireNewBpfByFaCreatedEvt:function(component, item) {
        var createEvent = $A.get("e.c:docmaNewBpfByFaCreatedEvt");
        var faItem = component.get("v.faItem");
        createEvent.setParams({
            "bpfItem":item,
            "bpItem": item.nuncbau__Blue_Print_Name__r,
            "bpId":item.nuncbau__Blue_Print_Name__c,
        });
                
        createEvent.fire();
        
        var title = item.Name+" record was created!";
        var msg = "The object was created successfully";
        var type = "success";
        this.showToast(title, msg, type);
    },    
    
    //A BP was edited.
    fireBpfEditedEvt:function(component, item) {
        //var createEvent = component.getEvent("nuncNewBpEvent");  
        var createEvent = $A.get("e.c:docmaBpfEditedEvt");
        var bpItem = component.get("v.bpItem");
        var bpId = component.find("bpSelect").get("v.value");
        var faItem = component.get("v.faItem");
        
        
        createEvent.setParams ({
            "bpfItem":item,
            "bpItem": bpItem,
            "bpId":bpItem.Id,
            "faItem":faItem
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