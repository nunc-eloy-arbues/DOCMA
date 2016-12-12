public class NuncNewDtPanelController {
    
    @AuraEnabled
    public static nuncbau__DOD_Type__c SaveItem(nuncbau__DOD_Type__c item) 
    {   
        nuncbau__DOD_Type__c newItem = DODTypeController.SaveItem(item);
        return newItem;
    } // end function        
    
}