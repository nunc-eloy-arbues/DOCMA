public with sharing class NuncNewBpfPanelController {
    
    @AuraEnabled
    public static List<nuncbau__DOD_Field_Assignment__c> GetFaListByDtId(string recordID) {
        List<nuncbau__DOD_Field_Assignment__c> faList = DODTypeController.GetFieldAssignmentById(recordID);
        return faList;
    }   
    
    @AuraEnabled
    public static List<nuncbau__DOD_Blue_Print_Setup__c> GetBpListByDtId(string recordID) {
        List<nuncbau__DOD_Blue_Print_Setup__c> bpList = DODTypeController.GetBlueprintById(recordID);
        return bpList;
    }   
    
    
    @AuraEnabled
    public static nuncbau__DOD_User_Dialog_Field__c SaveItem(nuncbau__DOD_User_Dialog_Field__c item) {
        item = DODUserDialogFieldsController.SaveItem(item);
        return item;
    } 
}