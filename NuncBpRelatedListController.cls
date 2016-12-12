public class NuncBpRelatedListController {
    @AuraEnabled
    public static List<nuncbau__DOD_Blue_Print_Setup__c> GetBluePrintListById(string recordID){
        
        List<nuncbau__DOD_Blue_Print_Setup__c> blueprintList = DODTypeController.getBlueprintById(recordID);
        return blueprintList;                 
    }
    
    @AuraEnabled
    public static nuncbau__DOD_Blue_Print_Setup__c DeleteBlueprintById(string recordID){
        
        nuncbau__DOD_Blue_Print_Setup__c item = DODBluePrintSetupController.DeleteItemById(recordID);
        return item;                 
    } 
    
    @AuraEnabled
    public static nuncbau__DOD_Blue_Print_Setup__c CloneBpByBpId(string recordID){
        
        nuncbau__DOD_Blue_Print_Setup__c item = DODBluePrintSetupController.CloneBluePrintDocument(recordID);
        return item;                 
    }     
    
    @AuraEnabled
    public static nuncbau__DOD_Type__c GetDtByBpId(string recordID){
        
        nuncbau__DOD_Type__c item = [select id, Name from nuncbau__DOD_Type__c where id=:recordID];
        
        return item;                 
    }         
}