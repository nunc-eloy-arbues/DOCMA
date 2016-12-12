/*
 * @author: torsten.mueller@nunc-solutions.de
 * @date: 2016-09-27
 * @update: 2016-10-26
 * @desc: class to deal with DOD Engine custom object nuncbau__DOD_Field_Assignment__c
 */
public with sharing class DODFieldAssignmentController
{
    /*
     * @desc function to get all DOD_Field_Assignment back
     * @param EMPTY
     * @return List nuncbau__DOD_Field_Assignment__c
     */ 
    @AuraEnabled
    public static List<nuncbau__DOD_Field_Assignment__c> GetItems() {
        // Check to make sure all fields are accessible to this user
        String[] fieldsToCheck = new String[] {
            'Id', 'Name', 'nuncbau__DOD_Field_Data_Type__c', 'nuncbau__DOD_Type__c'
        };
        
        Map<String,Schema.SObjectField> fieldDescribeTokens = 
            Schema.SObjectType.nuncbau__DOD_Field_Assignment__c.fields.getMap();
        
        for(String field : fieldsToCheck) {
            if( ! fieldDescribeTokens.get(field).getDescribe().isAccessible()) {
                throw new System.NoAccessException();
                return null;
            }
        }

        List <nuncbau__DOD_Field_Assignment__c> AllItems = [ select Id, Name, nuncbau__DOD_Field_Data_Type__c, nuncbau__DOD_Type__r.Name, nuncbau__DOD_Type__r.Id 
                                                             from nuncbau__DOD_Field_Assignment__c ];
        return AllItems; 
    } // end function
        
    /*
     * @desc function to store or update a new DOD_Field_Assingment item
     * @param object nuncbau__DOD_Field_Assignment__c
     * @return object nuncbau__DOD_Field_Assignment__c
     */ 
    @AuraEnabled
    public static nuncbau__DOD_Field_Assignment__c SaveItem(nuncbau__DOD_Field_Assignment__c DODFieldAssignment) {
        /**
        // Perform isUpdatable() checking first, then
        String[] fieldsToCheck = new String[] {
            'Id', 'Name', 'nuncbau__DOD_Field_Data_Type__c', 'nuncbau__DOD_Type__c'
                };
                    
         Map<String,Schema.SObjectField> fieldDescribeTokens = 
         Schema.SObjectType.nuncbau__DOD_Type__c.fields.getMap();
        
        for(String field : fieldsToCheck) {
            if( ! fieldDescribeTokens.get(field).getDescribe().isUpdateable()) {
                throw new System.NoAccessException();
                return null;
            }
        }
        **/
        
        try{
        	upsert DODFieldAssignment;
        }catch(DmlException e){
        	System.debug('ERROR DODFieldAssignment SaveItem: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
      	DODFieldAssignment = [ select Id, Name, nuncbau__DOD_Field_Data_Type__c, nuncbau__DOD_Type__r.Name, nuncbau__DOD_Type__r.Id from nuncbau__DOD_Field_Assignment__c where id =:DODFieldAssignment.id ];
        return DODFieldAssignment;
    } // end function
    
    /*
     * @desc function to delete a given nuncbau__DOD_Field_Assignment__c object
     * @param object nuncbau__DOD_Field_Assignment__c
     * @return object nuncbau__DOD_Field_Assignment__c or null by error
     */ 
    @AuraEnabled
    public static nuncbau__DOD_Field_Assignment__c DeleteItem(nuncbau__DOD_Field_Assignment__c DODFieldAssignment) {
        /**
        // Perform isUpdatable() checking first, then
        String[] fieldsToCheck = new String[] {
            'Id', 'Name', 'nuncbau__DOD_Field_Data_Type__c', 'nuncbau__DOD_Type__c'
                };
                    
         Map<String,Schema.SObjectField> fieldDescribeTokens = 
         Schema.SObjectType.nuncbau__DOD_Type__c.fields.getMap();
        
        for(String field : fieldsToCheck) {
            if( ! fieldDescribeTokens.get(field).getDescribe().isUpdateable()) {
                throw new System.NoAccessException();
                return null;
            }
        }
        **/
         try{
        	delete DODFieldAssignment;
         }catch(DmlException e){
        	System.debug('ERROR DODFieldAssignment DeleteItem: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        return DODFieldAssignment;
    } // end function
    
    /*
     * @desc function to get all DOD_Type__c items
     * @param EMPTY
     * @return List nuncbau__DOD_Type__c  
     */ 
    @AuraEnabled
    public static List<nuncbau__DOD_Type__c> GetItemsDODType() 
    {
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
        
        List <nuncbau__DOD_Type__c> AllDODTypes = [SELECT Id, Name FROM nuncbau__DOD_Type__c ORDER BY createdDate ASC];
        return AllDODTypes;
    } // end function
    
    /*
     * @desc function to deltete a specific record by his ID
     * @param string recordID nuncbau__DOD_Field_Assignment__c object
     * @return object nuncbau__DOD_Field_Assignment__c
     */ 
    @AuraEnabled
    public static nuncbau__DOD_Field_Assignment__c DeleteItemById(string recordID)
    {
     	nuncbau__DOD_Field_Assignment__c DeleteRecord = [ select id,name FROM nuncbau__DOD_Field_Assignment__c WHERE id = :recordID ];
        try{
            delete DeleteRecord;
        }catch(DmlException e){
            System.debug('ERROR DODTFieldAssignment DeleteItemById: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
        return DeleteRecord;
    } // end function
  
   /*
    * @desc function to get all uses DOD Field Data Types
    * @param EMPTY
    * @return List with values 
    */ 
   @AuraEnabled
    public static String[] GetDODFieldDataType()
    {
        List<SelectOption> options = new List<SelectOption>();
        String[] Picklist = new String[] { 'TEXT', 'NUMBER', 'PICKLIST', 'CHECKBOX', 'FILE' }; // TEST
        
        Schema.DescribeFieldResult fieldResult = nuncbau__DOD_Field_Assignment__c.DOD_Field_Data_Type__c.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		for( Schema.PicklistEntry f : ple) {
             options.add(new SelectOption(f.getLabel(), f.getValue()));
        }       
    	
        System.debug( options );
        integer z = 0;
       	for(  SelectOption i : options ) {
        	system.debug(i);
            //Picklist[z] = i.value;
            z++;
        }
        
        //System.debug('Ausgabe vor return - Picklist = ' + Picklist );
        return Picklist;
    } // end function
    
    /*
     * @desc function to get all assigned nuncbau_DOD_Field_Assignment back
     * @param string recordID = DODType ID
     * @return List nuncbau__DOD_Field_Assignment__c
     */
    @AuraEnabled
    public static List<nuncbau__DOD_Field_Assignment__c> GetFieldAssignmentById(string recordID){
    
        List<nuncbau__DOD_Field_Assignment__c> DODFields = DODTypeController.GetFieldAssignmentById(recordID);        
        return DODFields;
        
    } // end function
    
    /*
     * @desc function to get all assigned Blue Print Setup with a given DODType ID
     * @param string recordID = DODType ID
     * @return List nuncbau__DOD_Blue_Print_Setup__c
     */ 
    @AuraEnabled
    public static List<nuncbau__DOD_Blue_Print_Setup__c> GetBlueprintById(string recordID){
        
        List<nuncbau__DOD_Blue_Print_Setup__c> BluePrintItems = DODTypeController.getBlueprintById(recordID);
        return BluePrintItems;
        
    } // end function
} // end class