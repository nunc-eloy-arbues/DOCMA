public class NuncNewBpPanelController {
    
    @AuraEnabled
    public static List<nuncbau__DOD_Type__c> GetItemsDODType() 
    {   
        List<nuncbau__DOD_Type__c> DtList = DODBluePrintSetupController.GetItemsDODType();
        return DtList;
    } // end function
    
    @AuraEnabled
    public static nuncbau__DOD_Blue_Print_Setup__c SaveItem(nuncbau__DOD_Blue_Print_Setup__c item) 
    {   
        nuncbau__DOD_Blue_Print_Setup__c newItem = DODBluePrintSetupController.SaveItem(item);
        return newItem;
    } // end function        
    
}