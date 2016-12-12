public with sharing class NuncFaRelatedListController {
    
    @AuraEnabled
    public static List<nuncbau__DOD_Field_Assignment__c> GetFaListByDtId(string recordID){
        
        List<nuncbau__DOD_Field_Assignment__c> faList = DODFieldAssignmentController.GetFieldAssignmentById(recordID);
        return faList;                 
    }
    
    @AuraEnabled
    public static nuncbau__DOD_Field_Assignment__c DeleteFaById(string recordID){
        
        nuncbau__DOD_Field_Assignment__c item = DODFieldAssignmentController.DeleteItemById(recordID);
        return item;                 
    }    
}