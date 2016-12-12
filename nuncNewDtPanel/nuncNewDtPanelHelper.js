({
    
    /******************************
     * CREATE OBJECT
    ******************************/    
    
    //Validate new object
    validateDtItem: function(component) {        
        var validItem = true;
        
        var Name = component.find("itemName");   
        var NameValue = Name.get("v.value");
        
        // Name must not be blank        
        if ($A.util.isEmpty(NameValue)){
            validItem = false;
            Name.set("v.errors", [{message:"Document type name can't be blank."}]);
        } else {      
            Name.set("v.errors", null);
        }
        
        return(validItem);
    },
    
    //Save all information from formular
    saveItem:function(component, event, helper) { 
        var itemName = component.find("itemName").get("v.value");
        
        var mode = component.get("v.mode");
        
        if (mode == "edit") {
            var dtItem = component.get("v.newDtObject");
            component.set("v.newDtObject", 
                          {'sobjectType':'nuncbau__DOD_Type__c', 
                           'Name':itemName,
                           'Id':dtItem.Id
                          }); 
        }else{
            component.set("v.newDtObject", 
                          {'sobjectType':'nuncbau__DOD_Type__c', 
                           'Name':itemName
                          }); 
        }
        
        this.createNewDtItem(component);
    },
    
    //Creates the new object on Server and fire events
    createNewDtItem:function(component) {
        var item = component.get("v.newDtObject");
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
                        this.fireDtEditedEvt(component, rItem);
                    } else if (mode == "new"){                       
                        this.fireNewDtCreatedEvt(component, rItem);
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
    
    /********************************
     * DOCMA EVENT SYSTEM
    ********************************/
    
    //A Document type record was created.
    fireNewDtCreatedEvt:function(component, item) {
        var createEvent = $A.get("e.c:docmaNewDtCreatedEvt");
        
        createEvent.setParams ({
            "dtItem": item,
        });       
        
        createEvent.fire();
        
        var title = item.Name+" record was created!";
        var msg = "The object was created successfully";
        var type = "success";
        this.showToast(title, msg, type);
    },   
    
    //A Document type record was edited.
    fireDtEditedEvt:function(component, item) {
        var createEvent = $A.get("e.c:docmaDtEditedEvt");
        
        createEvent.setParams ({
            "dtItem": item,
        });       
        
        createEvent.fire();
        
        var title = item.Name+" record was edited!";
        var msg = "The object was edited successfully";
        var type = "success";
        this.showToast(title, msg, type);
    }, 
    
    /********************************
     * EVENTS & TOAST
    ********************************/   
    
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