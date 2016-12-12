/*
* @author: torsten.mueller@nunc-solutions
* @date: 2016-09-29
* @update: 2016-10-26
* @desc: class to handle actions based on object nuncbau__DOD_Blue_Print_Setup__c
*/

public class DODBluePrintSetupController
{
    // function to get all items back
    @AuraEnabled
    public static List<nuncbau__DOD_Blue_Print_Setup__c> GetItems()
    {
        // Check to make sure all fields are accessible to this user
        String[] fieldsToCheck = new String[] {
            'Id', 'Name'
                };
                    
                    Map<String,Schema.SObjectField> fieldDescribeTokens = 
                    Schema.SObjectType.nuncbau__DOD_Blue_Print_Setup__c.fields.getMap();
        
        for(String field : fieldsToCheck) {
            if( ! fieldDescribeTokens.get(field).getDescribe().isAccessible()) {
                throw new System.NoAccessException();
                return null;
            }
        }
        
        // OK, they're cool, let 'em through
        nuncbau__DOD_Blue_Print_Setup__c[] AllItems = [select id, name, nuncbau__DOD_Type__r.Name, nuncbau__Description__c, nuncbau__Parent_Blue_Print__r.Name
                                                       from nuncbau__DOD_Blue_Print_Setup__c ORDER BY createdDate ASC];
        
        return AllItems;
    } // end function
    
    // function to save a new items
    @AuraEnabled
    public static nuncbau__DOD_Blue_Print_Setup__c SaveItem(nuncbau__DOD_Blue_Print_Setup__c DODPluePrintSetup)
    {
        // Perform isUpdateable() checking first, then
        /**
            String[] fieldsToCheck = new String[] {
            'Id', 'Name'
            };
            
            Map<String,Schema.SObjectField> fieldDescribeTokens = 
            Schema.SObjectType.nuncbau__DOD_Blue_Print_Setup__c.fields.getMap();
            
            for(String field : fieldsToCheck) {
                if( ! fieldDescribeTokens.get(field).getDescribe().isUpdateable()) {
                	throw new System.NoAccessException();
                	return null;
                }
            }
            **/
        
        try{
            upsert DODPluePrintSetup;  
        }catch(DmlException e){
            System.debug('ERROR DODBluePrintSetup SaveItem: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        return DODPluePrintSetup;
    } // end function
    
    // function to delete an item by given object
    @AuraEnabled
    public static nuncbau__DOD_Blue_Print_Setup__c DeleteItem(nuncbau__DOD_Blue_Print_Setup__c DODPluePrintSetup)
    {
        /**
            // Perform isUpdateable() checking first, then
            String[] fieldsToCheck = new String[] {
            'Id', 'Name'
            };
            
            Map<String,Schema.SObjectField> fieldDescribeTokens = 
            Schema.SObjectType.nuncbau__DOD_Blue_Print_Setup__c.fields.getMap();
            
            for(String field : fieldsToCheck) {
                if( ! fieldDescribeTokens.get(field).getDescribe().isUpdateable()) {
                	throw new System.NoAccessException();
                	return null;
                }
            }
            **/
        
        try{
            delete DODPluePrintSetup;  
        }catch(DmlException e){
            System.debug('ERROR DODBluePrintSetup DeleteItem: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        return DODPluePrintSetup;
    } // end function
    
    // function to delete an item by a given record Id
    @AuraEnabled
    public static nuncbau__DOD_Blue_Print_Setup__c DeleteItemById(string recordId)
    {
        nuncbau__DOD_Blue_Print_Setup__c deleteItem = [select id,Name, nuncbau__DOD_Type__c from nuncbau__DOD_Blue_Print_Setup__c where id = :recordId ];    
        try{	
            delete deleteItem;
        }catch(DmlException e){
            System.debug('ERROR DODPluePrintSetup DeleteItemById: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        return  deleteItem;
    } // end function
    
    // function to get all assigned DOD fields by BluePrint Setup ID
    @AuraEnabled
    public static List<nuncbau__DOD_User_Dialog_Field__c> GetItemsDODUserDialogFieldsById(string recordId)
    {
        nuncbau__DOD_User_Dialog_Field__c[] DODFields = [select id, Name, nuncbau__Blue_Print_Name__r.Id, nuncbau__Blue_Print_Name__r.Name, 
                                                         nuncbau__DOD_Field__r.Id, nuncbau__DOD_Field__r.Name, nuncbau__Fixed__c, nuncbau__Value__c 
                                                         from nuncbau__DOD_User_Dialog_Field__c 
                                                         where nuncbau__Blue_Print_Name__r.Id = :recordId ];
        
        return DODFields;
    } // end function
    
    /*************************************************************************/
    /* CODE BY ELOY@05-10-16: Copied from DODTypeController.GetItems()       */
    /*************************************************************************/
    @AuraEnabled
    public static List<nuncbau__DOD_Type__c> GetItemsDODType() 
    {
       /** 
        // Check to make sure all fields are accessible to this user
        String[] fieldsToCheck = new String[] {
            'Id', 'Name'
                };
                    
                    Map<String,Schema.SObjectField> fieldDescribeTokens = 
                    Schema.SObjectType.nuncbau__DOD_Type__c.fields.getMap();
        
        for(String field : fieldsToCheck) {
            if( ! fieldDescribeTokens.get(field).getDescribe().isAccessible()) {
                throw new System.NoAccessException();
                return null;
            }
        }
       **/        
        List<nuncbau__DOD_Type__c> Allitems = [select id, name from nuncbau__DOD_Type__c ORDER BY createdDate ASC];
        return Allitems;
    } // end function
    
    /*
     * @desc  To get all related DOD_User_Dialog_Fields from a Blueprint by Blueprint.Id
     * @param string recordID
     * @return object nuncbau__DOD_User_Dialog_Field__c
     */
    @AuraEnabled
    public static List<nuncbau__DOD_User_Dialog_Field__c> GetBlueprintFieldsById(string recordID){
        
        List<nuncbau__DOD_User_Dialog_Field__c> AllFieldsBP = [select Id,nuncbau__Blue_Print_Name__r.Name,	
                                                               nuncbau__DOD_Field__r.Name, nuncbau__Fixed__c, nuncbau__Value__c
                                                               from nuncbau__DOD_User_Dialog_Field__c
                                                               where nuncbau__Blue_Print_Name__r.Id = :recordID]; 
   		return AllFieldsBP;     
    } //end function
    
    /*
     * @desc function to clone a Blue Print Document inclusive all assigned DOD User Dialog Fields/Blue Print Fields
     * @param string record ID BPD
     * @return object nuncbau__DOD_Blue_Print_Setup__c
     */ 
    @AuraEnabled 
    public static nuncbau__DOD_Blue_Print_Setup__c CloneBluePrintDocument(string recordID){
        string sNamePrefix = 'CLONE OF ';
        List<nuncbau__DOD_Blue_Print_Setup__c> CopyBluePrint = new List<nuncbau__DOD_Blue_Print_Setup__c>();
        List<nuncbau__DOD_User_Dialog_Field__c> CopyBluePrintFields = new List<nuncbau__DOD_User_Dialog_Field__c>();
        
        List<nuncbau__DOD_Blue_Print_Setup__c> SourceBluePrint = [	select Name, nuncbau__Description__c, nuncbau__DOD_Type__r.Id 
                       				from nuncbau__DOD_Blue_Print_Setup__c
                       				where Id = :recordID ];
      
        for(nuncbau__DOD_Blue_Print_Setup__c Source : SourceBluePrint ){
           nuncbau__DOD_Blue_Print_Setup__c Tmp = new nuncbau__DOD_Blue_Print_Setup__c(Name=sNamePrefix+Source.Name,nuncbau__Description__c=Source.nuncbau__Description__c,nuncbau__DOD_Type__c=Source.nuncbau__DOD_Type__r.Id );
           CopyBluePrint.add(Tmp); // add Element at new list
        } 
        
        try{
            insert CopyBluePrint;
        }catch(System.DMLException e){
            System.debug('ERROR cloning Blueprint Document: ' + e.getMessage() + ' / ' + e.getCause() );
            return null;
        }
        
        List<nuncbau__DOD_User_Dialog_Field__c> AllAssignedFields = [ select nuncbau__Blue_Print_Name__r.Id, nuncbau__DOD_Field__r.Id, nuncbau__Fixed__c, nuncbau__Value__c 
                                                         from nuncbau__DOD_User_Dialog_Field__c 
                                                         where nuncbau__Blue_Print_Name__r.Id = :recordID ];
        
        for(nuncbau__DOD_User_Dialog_Field__c Item : AllAssignedFields ){
            nuncbau__DOD_User_Dialog_Field__c Tmp = new nuncbau__DOD_User_Dialog_Field__c(nuncbau__Blue_Print_Name__c=CopyBluePrint[0].Id,nuncbau__DOD_Field__c=Item.nuncbau__DOD_Field__r.Id, nuncbau__Fixed__c=Item.nuncbau__Fixed__c, nuncbau__Value__c=Item.nuncbau__Value__c );
            CopyBluePrintFields.add(Tmp);
        }
        
        try{
          insert CopyBluePrintFields;
        }catch(System.DMLException e){
            System.debug('ERROR cloning Blueprint fields: ' + e.getMessage() + ' / ' + e.getCause() );
            return null;
        }
        
        /**
        List<nuncbau__DOD_User_Dialog_Field__c> CloneBluePrintFields = [ select Id,Name,nuncbau__Blue_Print_Name__r.Id, nuncbau__Blue_Print_Name__r.Name, nuncbau__DOD_Field__r.Id, nuncbau__DOD_Field__r.Name, nuncbau__Fixed__c, nuncbau__Value__c 
                                                         				from nuncbau__DOD_User_Dialog_Field__c 
                                                         				where nuncbau__Blue_Print_Name__r.Id = :CopyBluePrint[0].Id ];
        **/
        nuncbau__DOD_Blue_Print_Setup__c CloneBluePrint = [ select Id, Name, nuncbau__Description__c, nuncbau__DOD_Type__r.Id, nuncbau__DOD_Type__r.Name 
                                                          	from nuncbau__DOD_Blue_Print_Setup__c
                                                          	where Id = :CopyBluePrint[0].Id ];
        return CloneBluePrint;
    } // end function
} // end class