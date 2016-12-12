public with sharing class NuncNewFaPanelController {
    
    @AuraEnabled
    public static List<nuncbau__DOD_Type__c> GetDocTypeList() {
        
        List<nuncbau__DOD_Type__c> listItems = DODTypeController.GetItems();
        return listItems;                 
    }
    
    @AuraEnabled
    public static String[] GetDataTypeList() {
        String[] listItems = DODFieldAssignmentController.GetDODFieldDataType();
        return listItems;
    }   
    
    @AuraEnabled
    public static nuncbau__DOD_Field_Assignment__c GetFieldAssignmentById(string recordID) {
        nuncbau__DOD_Field_Assignment__c faObject = [select Id, Name, nuncbau__DOD_Field_Data_Type__c, nuncbau__DOD_Type__r.Name, nuncbau__DOD_Type__r.Id 
                                                     from nuncbau__DOD_Field_Assignment__c  
                                                     WHERE id = :recordID];
        return faObject;
    }   
    
    @AuraEnabled
      public static nuncbau__DOD_Field_Assignment__c SaveItem(nuncbau__DOD_Field_Assignment__c item) {
        item = DODFieldAssignmentController.SaveItem(item);
        return item;
    } 
}