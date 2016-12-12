public class NuncDtSliderController {
    
    @AuraEnabled
    public static List<nuncbau__DOD_Type__c> GetItemsDT() 
    {
        List<nuncbau__DOD_Type__c> Allitems = [select id, name from nuncbau__DOD_Type__c ORDER BY createdDate ASC];
        return Allitems;
    }
    
    @AuraEnabled
    public static integer GetAmountFields(string recordID){
        
        integer amountFields = DODTypeController.GetAmountFields(recordID);
        return amountFields;                 
    }

    @AuraEnabled
    public static integer GetAmountRelatedBlueprint(string recordID){
        
        integer amount = DODTypeController.GetRelatedBlueprintAmountById(recordID);
        return amount;                 
    }    
    
    @AuraEnabled
    public static nuncbau__DOD_Type__c DeleteItemById(string recordID){
        
        nuncbau__DOD_Type__c item = DODTypeController.DeleteItemById(recordID);
        return item;                 
    }    
    
    @AuraEnabled
    public static nuncbau__DOD_Type__c CloneDtByDtId(string recordID){
        
        nuncbau__DOD_Type__c item = DODTypeController.CloneDODType(recordID);
        return item;                 
    }        
    
    @AuraEnabled
    public static nuncbau__DOD_Blue_Print_Setup__c CreateBlueprint(nuncbau__DOD_Blue_Print_Setup__c DODBluePrintSetup){
        
        nuncbau__DOD_Blue_Print_Setup__c item = DODBluePrintSetupController.SaveItem(DODBluePrintSetup);
        return item;                 
    }  
    
    
    @AuraEnabled
    public static List<nuncbau__DOD_User_Dialog_Field__c> GetBlueprintFieldsById(string recordID){
        
        List<nuncbau__DOD_User_Dialog_Field__c> amountBp = DODBluePrintSetupController.GetBlueprintFieldsById(recordID);
        return amountBp;                 
    }  
    
    
}