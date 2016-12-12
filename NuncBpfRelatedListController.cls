public with sharing class NuncBpfRelatedListController {
    
    @AuraEnabled
    public static List<nuncbau__DOD_User_Dialog_Field__c> GetBpfList() {
        
        List<nuncbau__DOD_User_Dialog_Field__c> listItems = DODUserDialogFieldsController.GetItems();
        return listItems;                 
    }
    
    @AuraEnabled
    public static List<nuncbau__DOD_User_Dialog_Field__c> GetBpfListByBpId(String recordId) {
        
        List <nuncbau__DOD_User_Dialog_Field__c> AllItems = DODBluePrintSetupController.GetItemsDODUserDialogFieldsById(recordId);
        
        return AllItems;                 
    }
    
    @AuraEnabled
    public static nuncbau__DOD_Blue_Print_Setup__c GetBpInfoByBpId(String recordId) {
        
        nuncbau__DOD_Blue_Print_Setup__c item = [select Id, Name, nuncbau__DOD_Type__c, nuncbau__DOD_Type__r.Name, nuncbau__Description__c, nuncbau__Parent_Blue_Print__c from nuncbau__DOD_Blue_Print_Setup__c where Id =:recordId ];    
        
        return item;                 
    }
    
    @AuraEnabled
    public static nuncbau__DOD_User_Dialog_Field__c DeleteBpfById(string recordId)
    {
        nuncbau__DOD_User_Dialog_Field__c deleteItem = [select id, Name, nuncbau__Blue_Print_Name__c, nuncbau__DOD_Field__c from nuncbau__DOD_User_Dialog_Field__c where id = :recordId ];    
        try{	
            delete deleteItem;
        }catch(DmlException e){
            System.debug('ERROR NuncBpfRelatedListController DeleteItemById: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        return  deleteItem;
    } // end function  
}